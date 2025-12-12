import express from 'express';
import { UserController } from './users/UserController';

const router = express().router;

const userController = new UserController();

router.get('/me', userController.getMe);

export default router;
