import BlacklistToken from '../models/BlacklistToken';
import Exception from '../models/Exception';


class BlacklistTokenController {
    async create(req, res) {
        try {
            await BlacklistToken.create({ token: req.token });

            return res.json({
                logout: true,
            });
        } catch (error) {
            Exception.create({
                action: 'BlacklistToken:Create',
                exception: error.toString(),
            });
            return res.status(500).json({error: 'Unexpected error'});
        }
    }
}
export default new BlacklistTokenController();