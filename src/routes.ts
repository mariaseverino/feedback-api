import express from 'express';
import { UserController } from './users/UserController';
import { ensureAuthenticated } from './midleware/ensureAuthenticated';
import { FeedbackController } from './feedback/feedbackController';

const routes = express().router;

const userController = new UserController();
const feedbackController = new FeedbackController();

routes.get('/me', ensureAuthenticated, userController.getMe);
routes.post(
    '/feedbacks/send',
    ensureAuthenticated,
    feedbackController.sendFeedback
);
routes.get(
    '/feedbacks',
    ensureAuthenticated,
    feedbackController.getReceivedsFeedbacks
);

export default routes;
