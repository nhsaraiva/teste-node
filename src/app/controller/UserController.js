import * as Yup from 'yup';
import User from '../models/User';
import Exception from '../models/Exception';


class UserController {
    async create(req, res) {
        try {
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
        } catch (error) {
            Exception.create({
                action: 'UserController:Create',
                exception: error.toString(),
            });
            return res.status(500).json({error: 'Unexpected error'});
        }
    }
}

export default new UserController();