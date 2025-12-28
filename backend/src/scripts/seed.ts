'use strict';

import prisma from '../config/database';
import { logger } from '../config/logger';

const companies = [
    {
        companyName: 'Reliance Industries',
        symbol: 'RELIANCE',
        sector: 'Energy',
        currentPrice: 2450.50,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 1650000,
        peRatio: 28.5,
        dividendYieldPercent: 0.35,
        description: 'India\'s largest private sector company with interests in petrochemicals, refining, oil, telecommunications and retail.',
    },
    {
        companyName: 'Tata Consultancy Services',
        symbol: 'TCS',
        sector: 'IT',
        currentPrice: 3850.75,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 1400000,
        peRatio: 32.8,
        dividendYieldPercent: 1.2,
        description: 'Leading global IT services, consulting and business solutions organization.',
    },
    {
        companyName: 'HDFC Bank',
        symbol: 'HDFCBANK',
        sector: 'Banking',
        currentPrice: 1650.25,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 1250000,
        peRatio: 22.4,
        dividendYieldPercent: 0.85,
        description: 'India\'s largest private sector bank offering a wide range of banking and financial services.',
    },
    {
        companyName: 'Infosys',
        symbol: 'INFY',
        sector: 'IT',
        currentPrice: 1520.60,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 630000,
        peRatio: 26.7,
        dividendYieldPercent: 2.1,
        description: 'Global leader in next-generation digital services and consulting.',
    },
    {
        companyName: 'ICICI Bank',
        symbol: 'ICICIBANK',
        sector: 'Banking',
        currentPrice: 1050.30,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 740000,
        peRatio: 18.9,
        dividendYieldPercent: 0.95,
        description: 'Leading private sector bank in India offering comprehensive banking products.',
    },
    {
        companyName: 'Bharti Airtel',
        symbol: 'BHARTIARTL',
        sector: 'Telecom',
        currentPrice: 1350.80,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 780000,
        peRatio: 45.2,
        dividendYieldPercent: 0.45,
        description: 'Leading telecommunications services provider in India.',
    },
    {
        companyName: 'Asian Paints',
        symbol: 'ASIANPAINT',
        sector: 'Consumer Goods',
        currentPrice: 2950.40,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 280000,
        peRatio: 58.3,
        dividendYieldPercent: 0.65,
        description: 'India\'s largest paint company with a strong presence in decorative and industrial coatings.',
    },
    {
        companyName: 'Wipro',
        symbol: 'WIPRO',
        sector: 'IT',
        currentPrice: 425.90,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 230000,
        peRatio: 24.1,
        dividendYieldPercent: 1.8,
        description: 'Leading global information technology, consulting and business process services company.',
    },
    {
        companyName: 'Maruti Suzuki',
        symbol: 'MARUTI',
        sector: 'Automobile',
        currentPrice: 11250.00,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 340000,
        peRatio: 28.6,
        dividendYieldPercent: 0.55,
        description: 'India\'s largest passenger car manufacturer.',
    },
    {
        companyName: 'Titan Company',
        symbol: 'TITAN',
        sector: 'Consumer Goods',
        currentPrice: 3420.50,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 305000,
        peRatio: 72.4,
        dividendYieldPercent: 0.35,
        description: 'Leading manufacturer of watches, jewelry, and eyewear in India.',
    },
    {
        companyName: 'Bajaj Finance',
        symbol: 'BAJFINANCE',
        sector: 'Financial Services',
        currentPrice: 6850.75,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 420000,
        peRatio: 35.8,
        dividendYieldPercent: 0.25,
        description: 'Leading non-banking financial company offering consumer and business loans.',
    },
    {
        companyName: 'HCL Technologies',
        symbol: 'HCLTECH',
        sector: 'IT',
        currentPrice: 1280.40,
        marketCapCategory: 'large-cap',
        marketCapInrCrore: 350000,
        peRatio: 22.9,
        dividendYieldPercent: 2.5,
        description: 'Global technology company specializing in IT services and consulting.',
    },
    {
        companyName: 'Adani Green Energy',
        symbol: 'ADANIGREEN',
        sector: 'Energy',
        currentPrice: 1650.20,
        marketCapCategory: 'mid-cap',
        marketCapInrCrore: 260000,
        peRatio: 185.4,
        dividendYieldPercent: 0.0,
        description: 'India\'s largest renewable energy company.',
    },
    {
        companyName: 'Zomato',
        symbol: 'ZOMATO',
        sector: 'Technology',
        currentPrice: 185.60,
        marketCapCategory: 'mid-cap',
        marketCapInrCrore: 165000,
        peRatio: -42.5,
        dividendYieldPercent: 0.0,
        description: 'Leading food delivery and restaurant discovery platform.',
    },
    {
        companyName: 'Paytm',
        symbol: 'PAYTM',
        sector: 'Technology',
        currentPrice: 425.30,
        marketCapCategory: 'mid-cap',
        marketCapInrCrore: 270000,
        peRatio: -28.7,
        dividendYieldPercent: 0.0,
        description: 'Digital payments and financial services platform.',
    },
];

async function seed() {
    try {
        logger.info('Starting database seed...');

        logger.info('Clearing existing data...');
        await prisma.learningProgress.deleteMany();
        await prisma.expense.deleteMany();
        await prisma.sIPInvestment.deleteMany();
        await prisma.userStockHolding.deleteMany();
        await prisma.company.deleteMany();
        await prisma.user.deleteMany();

        logger.info('Seeding companies...');
        for (const company of companies) {
            await prisma.company.create({
                data: company,
            });
        }

        logger.info(`Seeded ${companies.length} companies`);
        logger.info('Database seed completed successfully!');
    } catch (error) {
        logger.error('Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seed();
