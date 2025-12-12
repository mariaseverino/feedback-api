import { accounts } from './accounts';
import {
    accountsRelations,
    sessionsRelations,
    usersRelations,
} from './relations';
import { sessions } from './sessions';
import { users } from './user';
import { verifications } from './verifications';

export const schema = {
    users,
    accounts,
    sessions,
    verifications,
    usersRelations,
    sessionsRelations,
    accountsRelations,
};
