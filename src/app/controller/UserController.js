import * as Yup from 'yup';
import User from '../models/User';


class UserController {
    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(8),
        })

        var validUser = await schema.isValid(req.body);
        if (!validUser) return res.status(400).json({ error: 'Invalid user.' });

        const userExist = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        
        if (userExist) return res.status(400).json({ error: 'User already exists.' });
        const { id, name, email } = await User.create(req.body);
        return res.json({
            id,
            name,
            email,
        });
    }
}

export default new UserController();