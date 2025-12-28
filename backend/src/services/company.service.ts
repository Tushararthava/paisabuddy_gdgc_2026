'use strict';

import prisma from '../config/database';
import { ApiError } from '../utils/response.util';

export class CompanyService {
    // Get all companies with optional filtering
    static async getAllCompanies(filters?: {
        sector?: string;
        marketCapCategory?: string;
        search?: string;
    }) {
        const where: any = {};

        if (filters?.sector) {
            where.sector = filters.sector;
        }

        if (filters?.marketCapCategory) {
            where.marketCapCategory = filters.marketCapCategory;
        }

        if (filters?.search) {
            where.OR = [
                { companyName: { contains: filters.search, mode: 'insensitive' } },
                { symbol: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const companies = await prisma.company.findMany({
            where,
            orderBy: {
                companyName: 'asc',
            },
        });

        return companies;
    }

    // Get company by ID
    static async getCompanyById(id: string) {
        const company = await prisma.company.findUnique({
            where: { id },
        });

        if (!company) {
            throw ApiError.notFound('Company not found');
        }

        return company;
    }

    // Get company by symbol
    static async getCompanyBySymbol(symbol: string) {
        const company = await prisma.company.findUnique({
            where: { symbol },
        });

        if (!company) {
            throw ApiError.notFound('Company not found');
        }

        return company;
    }

    // Create company (for seeding)
    static async createCompany(data: {
        companyName: string;
        symbol: string;
        sector: string;
        currentPrice: number;
        marketCapCategory: string;
        marketCapInrCrore?: number;
        peRatio?: number;
        dividendYieldPercent?: number;
        description?: string;
    }) {
        const existingCompany = await prisma.company.findUnique({
            where: { symbol: data.symbol },
        });

        if (existingCompany) {
            throw ApiError.conflict('Company with this symbol already exists');
        }

        const company = await prisma.company.create({
            data,
        });

        return company;
    }

    // Get unique sectors
    static async getSectors() {
        const companies = await prisma.company.findMany({
            select: {
                sector: true,
            },
            distinct: ['sector'],
        });

        return companies.map((c) => c.sector);
    }

    // Get unique market cap categories
    static async getMarketCapCategories() {
        const companies = await prisma.company.findMany({
            select: {
                marketCapCategory: true,
            },
            distinct: ['marketCapCategory'],
        });

        return companies.map((c) => c.marketCapCategory);
    }
}
