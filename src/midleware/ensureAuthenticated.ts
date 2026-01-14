import { auth } from '@/lib/auth';
import { Session, User } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { NextFunction, Request, Response } from 'express';

export const getAuthContext = async (headers: Request['headers']) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(headers),
    });

    // console.log({ session: session });
    return session;
};

// export interface AuthRequest {
//         auth?: {
//             user: {
//                 id: string;
//                 createdAt: Date;
//                 updatedAt: Date;
//                 email: string;
//                 emailVerified: boolean;
//                 name: string;
//                 image?: string | null | undefined;
//             };
//             session: Session;
//         };
//     }

// interface Session {
//     id: string;
//     createdAt: Date;
//     updatedAt: Date;
//     userId: string;
//     expiresAt: Date;
//     token: string;
//     ipAddress?: string | null | undefined;
//     userAgent?: string | null | undefined;
//     activeOrganizationId?: string | null | undefined;
// }

interface AuthRequest extends Request {
    auth: {
        user: User;
        session: Session;
    };
}

export async function ensureAuthenticated(
    request: AuthRequest,
    response: Response,
    next: NextFunction
) {
    const authCtx = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
    });

    // console.log(authCtx);

    if (!authCtx) {
        return response.status(401).json({ message: 'Não autenticado' });
    }

    console.log({ activeOrganizationId: authCtx.session.activeOrganizationId });

    request.auth = {
        user: authCtx.user,
        session: authCtx.session,
    };

    return next();
}
