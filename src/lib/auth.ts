import { db } from '@/database/client';
import { members, organizations } from '@/database/schema/auth-schema';
import { compare, hash } from 'bcrypt';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { and, desc, eq } from 'drizzle-orm';

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

    user: {
        deleteUser: {
            enabled: true,
            beforeDelete: async ({ id }) => {
                const userIsOwnerMember = await db
                    .select({ organizationId: members.organizationId })
                    .from(members)
                    .where(
                        and(eq(members.userId, id), eq(members.role, 'owner'))
                    )
                    .limit(1)
                    .then((res) => res[0]);

                if (userIsOwnerMember) {
                    await db
                        .delete(organizations)
                        .where(
                            eq(
                                organizations.id,
                                userIsOwnerMember.organizationId
                            )
                        );
                }
            },
        },
    },

    plugins: [
        organization({
            organizationHooks: {
                afterCreateOrganization: async ({}) => {},
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

                // afterAddMember: async ({ member, user, organization }) => {
                //     // Send welcome email, create default resources, etc.
                //     await sendWelcomeEmail(user.email, organization.name);
                // },
            },
        }),
    ],
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const org = await db.query.members.findFirst({
                        where: eq(members.userId, session.userId),
                    });

                    console.log({ member: org });
                    console.log(session);

                    session['activeOrganizationId'] = org?.organizationId;
                    console.log(session);

                    return {
                        data: {
                            session,
                        },
                    };
                },
            },
        },
    },
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
