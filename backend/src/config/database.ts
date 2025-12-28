'use strict';

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient({
    log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
    ],
});

if (process.env.NODE_ENV === 'development') {
    prisma.$on('query' as never, (e: any) => {
        logger.debug('Prisma Query:', {
            query: e.query,
            params: e.params,
            duration: `${e.duration}ms`,
        });
    });
}

prisma.$on('error' as never, (e: any) => {
    logger.error('Prisma Error:', e);
});

prisma.$on('warn' as never, (e: any) => {
    logger.warn('Prisma Warning:', e);
});

export const connectDatabase = async () => {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');
    } catch (error) {
        logger.error('Database connection failed:', error);
        process.exit(1);
    }
};

export const disconnectDatabase = async () => {
    try {
        await prisma.$disconnect();
        logger.info('Database disconnected');
    } catch (error) {
        logger.error('Error disconnecting database:', error);
    }
};

export default prisma;
