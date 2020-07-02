import { Router } from 'express';
const routes = new Router();

import UserController from './app/controller/UserController';

routes.get('/', (req, res)=>{
    return res.json({
        ok:true
    });
});
routes.get('/users', UserController.store);

export default routes;