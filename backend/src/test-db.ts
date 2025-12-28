import prisma from './config/database';
import { logger } from './config/logger';

async function test() {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');

        const companies = await prisma.company.findMany();
        logger.info(`Found ${companies.length} companies`);

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        logger.error('Error:', error);
        process.exit(1);
    }
}

test();
