import User from '../models/User';


class UserController {
    async store(req, res) {
        var user = new User();
        return res.json({
            teste: user.teste()
        });
    }
}

export default new UserController();