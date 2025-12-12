import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';

export const getAuthContext = async (headers: Request['headers']) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(headers),
    });
    return session;
};
