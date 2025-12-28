'use strict';

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000'),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default('1d'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CALLBACK_URL: z.string(),
    FRONTEND_URL: z.string().default('http://localhost:3000'),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
    console.error('Invalid environment variables:', envValidation.error.format());
    process.exit(1);
}

export const config = {
    env: envValidation.data.NODE_ENV,
    port: parseInt(envValidation.data.PORT, 10),
    database: {
        url: envValidation.data.DATABASE_URL,
    },
    jwt: {
        secret: envValidation.data.JWT_SECRET,
        refreshSecret: envValidation.data.JWT_REFRESH_SECRET,
        expiresIn: envValidation.data.JWT_EXPIRES_IN,
        refreshExpiresIn: envValidation.data.JWT_REFRESH_EXPIRES_IN,
    },
    google: {
        clientId: envValidation.data.GOOGLE_CLIENT_ID,
        clientSecret: envValidation.data.GOOGLE_CLIENT_SECRET,
        callbackUrl: envValidation.data.GOOGLE_CALLBACK_URL,
    },
    frontend: {
        url: envValidation.data.FRONTEND_URL,
    },
    logging: {
        level: envValidation.data.LOG_LEVEL,
    },
};
