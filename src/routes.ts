import express from 'express';
import { UserController } from './users/UserController';
import { ensureAuthenticated } from './midleware/ensureAuthenticated';

const routes = express().router;

const userController = new UserController();

routes.get('/me', ensureAuthenticated, userController.getMe);
routes.delete(
    '/delete-account',
    ensureAuthenticated,
    userController.deleteMyAccount
);

export default routes;
