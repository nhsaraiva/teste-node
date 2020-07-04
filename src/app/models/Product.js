import Sequelize, {Model} from 'sequelize';
import {v1 as uuidv1} from 'uuid';

class Product extends Model{
    static init(sequelize){
        super.init(
            {
                name: Sequelize.STRING,
                description: Sequelize.STRING,
                category: Sequelize.STRING,
                price: Sequelize.DECIMAL,
                stock: Sequelize.INTEGER,
            },
            {
                sequelize,
            }
        );

        this.addHook('beforeCreate', product => product.id = uuidv1());

        return this;
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    }

}

export default Product;