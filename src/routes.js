import { Router } from 'express';
const routes = new Router();

import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import ProductController from './app/controller/ProductController';

import authorizationMiddleware from './app/middleware/authorization';

routes.get('/', (req, res) => { return res.json({ ok: true }) });
routes.post('/users', UserController.create);
routes.post('/sessions', SessionController.create);

routes.use(authorizationMiddleware);

routes.post('/products', ProductController.create);
routes.get('/products', ProductController.read);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.delete);

export default routes;