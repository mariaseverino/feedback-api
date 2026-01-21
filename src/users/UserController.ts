import { db } from '@/database/client';
import { members, organizations, users } from '@/database/schema/auth-schema';
import { email, Session, User } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { and, eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

export class UserController {
    async getMe(request: Request, response: Response, next: NextFunction) {
        console.log(request.auth?.session);

        if (!request.auth) {
            return response.status(401).json({ message: 'Não autenticado' });
        }

        const user = await db
            .select({
                name: users.name,
                email: users.email,
                image: users.image,
                role: members.role,
                activeOrganizationId: organizations.id,
                organizationName: organizations.name,
            })
            .from(users)
            .leftJoin(members, eq(members.userId, request.auth?.session.userId))
            .leftJoin(
                organizations,
                eq(organizations.id, members.organizationId)
            )
            .where(
                and(
                    eq(users.id, request.auth.session.userId),
                    eq(
                        organizations.id,
                        request.auth.session.activeOrganizationId!
                    )
                )
            )
            .limit(1)
            .then((res) => res[0]);

        console.log(user);

        return response.status(200).json({
            user,
        });
    }

    // async deleteMyAccount(request: Request, response: Response) {
    //     const memberships = await db.query.members.findMany({
    //         where: eq(members.userId, request.auth?.session.userId!),
    //     });

    //     for (const membership of memberships) {
    //         if (membership.role === 'owner') {
    //             await db
    //                 .delete(organizations)
    //                 .where(eq(organizations.id, membership.organizationId));
    //         } else {
    //             await db.delete(members).where(eq(members.id, membership.id));
    //         }
    //     }

    //     await db.delete(users).where(eq(users.id, request.auth?.session.userId!));

    //     return response.status(200).json({ menssage: 'Adeus!' });
    // }
}
