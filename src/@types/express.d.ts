import { Session } from 'better-auth';

interface SessionWithActiveOrganization extends Session {
    activeOrganizationId?: string | undefined | null;
}

declare global {
    namespace Express {
        interface Request {
            auth?: {
                session: SessionWithActiveOrganization;
            };
        }
    }
}
