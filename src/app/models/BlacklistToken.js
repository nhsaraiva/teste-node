import Sequelize, { Model } from 'sequelize';
import { v1 as uuidv1 } from 'uuid';

class BlacklistToken extends Model {
    static init(sequelize) {
        super.init(
            {
                token: Sequelize.STRING,

            },
            {
                sequelize,
            }
        );

        this.addHook('beforeCreate', blacklist_token => blacklist_token.id = uuidv1());

        return this;
    }
}

export default BlacklistToken;