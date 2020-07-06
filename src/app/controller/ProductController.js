import Product from '../models/Product';
import Exception from '../models/Exception';
import User from '../models/User';
import { Op } from 'sequelize';
import validateId from 'uuid-validate';

class ProductController {
    async read(req, res) {
        try {
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
                attributes: ['id', 'name', 'description', 'category', 'price', 'stock'],
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
        } catch (error) {
            Exception.create({
                action: 'ProductController:Read',
                exception: error.toString(),
            });
            return res.status(500).json({error: 'Unexpected error'});
        }
    }
    async create(req, res) {
        try {
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
        } catch (error) {
            Exception.create({
                action: 'ProductController:Create',
                exception: error.toString(),
            });
            return res.status(500).json({error: 'Unexpected error'});
        }
    }
    async update(req, res) {
        try {
            if (!(validateId(req.params.id))) return res.status(400).json({ error: 'Product does not exists.' });

            const product = await Product.findOne({
                where: {
                    id: req.params.id,
                    user_id: req.userId,
                }
            });

            if (!product) return res.status(400).json({ error: 'Product does not exists.' });

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
        } catch (error) {
            Exception.create({
                action: 'ProductController:Update',
                exception: error.toString(),
            });
            return res.status(500).json({error: 'Unexpected error'});
        }
    }
    async delete(req, res) {
        try {
            if (!(validateId(req.params.id))) return res.status(400).json({ error: 'Product does not exists.' });

            const product = await Product.findOne({
                where: {
                    id: req.params.id,
                    user_id: req.userId,
                }
            });

            if (!product) return res.status(400).json({ error: 'Product does not exists.' });

            var productDelete = await product.destroy();
            productDelete = productDelete.length == 0 ? true : false;

            return res.json({ delete: productDelete });
        } catch (error) {
            Exception.create({
                action: 'ProductController:Delete',
                exception: error.toString(),
            });
            return res.status(500).json({error: 'Unexpected error'});
        }
    }
}

export default new ProductController();