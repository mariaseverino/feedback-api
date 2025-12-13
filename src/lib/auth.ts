import { db } from '@/database/client';
import { compare, hash } from 'bcrypt';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';

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
    plugins: [
        organization({
            organizationHooks: {
                beforeUpdateOrganization: async ({ organization }) => {
                    return {
                        data: {
                            ...organization,
                            name: organization.name?.toLowerCase(),
                        },
                    };
                },
                beforeCreateInvitation: async ({
                    invitation,
                    inviter,
                    organization,
                }) => {
                    // Custom validation or expiration logic
                    const customExpiration = new Date(
                        Date.now() + 1000 * 60 * 60 * 24 * 7
                    ); // 7 days
                    return {
                        data: {
                            ...invitation,
                            expiresAt: customExpiration,
                        },
                    };
                },
            },
        }),
    ],
    // databaseHooks:{session: {
    //     create: {
    //         before: async (session) => {
    //             const organization = await getActiveOrganization(
    //                 session.userId
    //             );
    //             return {
    //                 data: {
    //                     ...session,
    //                     activeOrganizationId: organization.id,
    //                 },
    //             };
    //         }
    //     }
    // }},
    baseURL: 'http://localhost:3333',
    trustedOrigins: ['http://localhost:5173', 'http://localhost:3000'],
});
