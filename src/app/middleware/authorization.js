import {promisify} from 'util';
import jwt from 'jsonwebtoken';
import authorizationConfig from '../../config/authorizationConfig';

export default async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) return res.status(401).json({error: 'Token not provided'});

    const [,token] = authorizationHeader.split(' ');

    try{
        const decoded = await promisify(jwt.verify)(token, authorizationConfig.secret);
        req.userId = decoded.id;

        return next();
    }catch(ex){
        return res.status(401).json({error: 'Invalid token'});
    }
}