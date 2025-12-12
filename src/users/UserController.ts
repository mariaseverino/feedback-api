import { getAuthContext } from '@/midleware/ensureAuthenticated';
import { Request, Response } from 'express';

export class UserController {
    async getMe(request: Request, response: Response) {
        console.log('teste');
        const ctx = await getAuthContext(request.headers);
        if (!ctx) {
            throw new Error(
                'Should Never Happer: This should have been handled by the middleware'
            );
        }
        return response.status(200).json({ user: ctx.user });
    }
}
