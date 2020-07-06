import Sequelize from 'sequelize';
import User from '../app/models/User';
import Product from '../app/models/Product';
import databaseConfig from '../config/database';
import Log from '../app/models/Log';
import BlacklistToken from '../app/models/BlacklistToken';
import Exception from '../app/models/Exception';

const models = [User, Product, Log, BlacklistToken, Exception];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models
            .map(model => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models));
    }
}


export default new Database();