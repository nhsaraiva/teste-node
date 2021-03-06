import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authorization from '../../config/authorizationConfig';
import Exception from '../models/Exception';

class SessionController {
    async create(req, res) {
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email().required(),
                password: Yup.string().required(),
            });

            var isValid = schema.isValid(req.body);
            if (!isValid) return res.json({ error: 'Invalid user.' });

            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(400).json({ error: 'User not found.' });

            var validPassword = await user.checkPassword(password);
            if (!validPassword) return res.status(401).json({ error: 'Incorrect password.' });

            const { id, name } = user;
            return res.json({
                user: {
                    id,
                    name,
                    email,
                },
                token: jwt.sign({ id }, authorization.secret, { expiresIn: authorization.expireIn }),
            });
        } catch (error) {
            Exception.create({
                action: 'SessionController:Create',
                exception: error.toString(),
            });
            return res.status(500).json({error: 'Unexpected error'});
        }
    }
}

export default new SessionController();