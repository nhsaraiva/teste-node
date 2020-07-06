import Sequelize, {Model} from 'sequelize';
import {v1 as uuidv1} from 'uuid';

class Log extends Model{
    static init(sequelize){
        super.init(
            {
                action: Sequelize.STRING,
                method: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        this.addHook('beforeCreate', log => log.id = uuidv1());

        return this;
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    }

}

export default Log;