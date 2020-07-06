import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import authorizationConfig from '../../config/authorizationConfig';
import Log from '../models/Log';
import BlacklistToken from '../models/BlacklistToken';

export default async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.status(401).json({ error: 'Token not provided' });

    const [, token] = authorizationHeader.split(' ');

    try {
        var isBadToken = await BlacklistToken.findOne({ where: { token } });
        if(isBadToken) return res.json({ error: 'Bad token' });

        const decoded = await promisify(jwt.verify)(token, authorizationConfig.secret);
        req.userId = decoded.id;
        req.token = token;

        await Log.create({
            action: req.url,
            method: req.method,
            user_id: req.userId,
        });

        return next();
    } catch (ex) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}