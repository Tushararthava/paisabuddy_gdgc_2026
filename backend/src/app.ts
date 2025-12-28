'use strict';

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { requestLogger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimiter.middleware';

import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes';
import stockRoutes from './routes/stock.routes';
import expenseRoutes from './routes/expense.routes';

const app: Application = express();

app.use(helmet());

app.use(
    cors({
        origin: [
            config.frontend.url,
            'https://paisabuddy1234.netlify.app',
            'http://localhost:3000'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(compression());

app.use(requestLogger);

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: config.env,
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/expenses', expenseRoutes);

app.use('/api', apiLimiter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
