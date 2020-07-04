import Product from '../models/Product';
import User from '../models/User';
import { Sequelize, Op } from 'sequelize';
import validateId from 'uuid-validate';

class ProductController {
    async read(req, res) {
        const { page = 1, name = '', description = '', category = '' } = req.query;

        const products = await Product.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                },
                description: {
                    [Op.iLike]: `%${description}%`
                },
                category: {
                    [Op.iLike]: `%${category}%`
                }
            },
            order: ['updated_at'],
            attributes: ['name', 'description', 'category', 'price', 'stock'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name'],
            }]
        });

        if (products.length == 0) return res.status(400).json({ error: 'No products found.' })

        return res.json(products);
    }
    async create(req, res) {
        req.body.user_id = req.userId;

        const productExist = await Product.findOne({
            where: {
                user_id: req.body.user_id,
                name: req.body.name,
            }
        });
        if (productExist) return res.status(400).json({ error: 'You already have a similar product registered' });

        const { id, name, description, category, price, stock, user_id } = await Product.create(req.body);

        return res.json({
            id,
            name,
            description,
            category,
            price,
            stock,
            user_id,
        });
    }
    async update(req, res) {
        if(!(validateId(req.params.id))) return res.status(400).json({ error: 'Product does not exists.' });

        const product = await Product.findByPk(req.params.id);

        if(!product) return res.status(400).json({ error: 'Product does not exists.' });

        if (req.body.name) {
            const productExist = await Product.findOne({
                where: {
                    user_id: req.userId,
                    name: req.body.name,
                }
            });

            if (productExist && productExist.id != product.id) return res.status(400).json({ error: 'You already have a similar product registered' });
        }

        const { id, name, description, category, price, stock, user_id } = await product.update(req.body);

        return res.json({
            id,
            name,
            description,
            category,
            price,
            stock,
            user_id,
        });
    }
    async delete(req, res) {
        if(!(validateId(req.params.id))) return res.status(400).json({ error: 'Product does not exists.' });
        
        const product = await Product.findByPk(req.params.id);

        if(!product) return res.status(400).json({ error: 'Product does not exists.' });
        
        var productDelete = await product.destroy();
        productDelete = productDelete.length == 0 ? true : false;

        return res.json({ delete:productDelete });
    }
}

export default new ProductController();