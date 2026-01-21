import { NextFunction, Request, Response } from 'express';
import { FeedbackService } from './feedbackService';

export class FeedbackController {
    private feedbackService: FeedbackService;
    constructor() {
        this.feedbackService = new FeedbackService();
    }
    async sendFeedback(request: Request, response: Response) {
        const data = request.body;

        await this.feedbackService.save(data, request.auth?.session.userId!);

        return response.status(201).json();
    }

    async getReceivedsFeedbacks(request: Request, response: Response) {
        const feebacks = await this.feedbackService.getFeedbacksById(
            request.auth?.session.userId!
        );

        return response.status(200).json({ feebacks });
    }
}
