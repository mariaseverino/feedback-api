import { db } from '@/database/client';
import { compare, hash } from 'bcrypt';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
    basePath: '/auth',
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true,
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        password: {
            hash: (password: string) => hash(password, 10),
            verify: ({ password, hash }) => compare(password, hash),
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },
    baseURL: 'http://localhost:3333',
    trustedOrigins: ['http://localhost:5173', 'http://localhost:3000'],
});
