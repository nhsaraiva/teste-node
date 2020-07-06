import Sequelize, {Model} from 'sequelize';
import {v1 as uuidv1} from 'uuid';

class Exception extends Model{
    static init(sequelize){
        super.init(
            {
                action: Sequelize.STRING,
                exception: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        this.addHook('beforeCreate', exception => exception.id = uuidv1());

        return this;
    }

}

export default Exception;