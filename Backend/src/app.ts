import express from 'express';
import cors from 'cors';
import doten from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
doten.config();

// validate env
import {validateEnv} from './utils/validate-env.utils';
validateEnv();

// configs
import {connectDb} from './config/mongo.config';
import {env} from './config/env.config';

// middlewares
import {errorHandler} from './middleware/error.middleware';

// cron jobs

//routes
import authRoutes from '@/routes/auth/auth.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';



const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-token-version'],
    }),
);

app.use(cookieParser());
app.use(morgan("dev"));

connectDb();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);
  
export default app;