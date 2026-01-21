import { auth } from '@/lib/auth';
import { Session, User } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { NextFunction, Request, Response } from 'express';

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authCtx = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
    });

    if (!authCtx) {
        return response.status(401).json({ message: 'Não autenticado' });
    }

    request.auth = {
        session: authCtx.session,
    };

    return next();
}
