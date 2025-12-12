import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';
import router from './routes';

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

app.use('/auth', toNodeHandler(auth));

app.use(router);

app.listen(3333, () => console.log('Server running on http://localhost:3333'));
