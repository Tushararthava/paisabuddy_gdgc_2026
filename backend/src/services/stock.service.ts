'use strict';

import prisma from '../config/database';
import { ApiError } from '../utils/response.util';
import { CompanyService } from './company.service';

export class StockService {
    // Get user stock holdings
    static async getUserHoldings(userId: string) {
        const holdings = await prisma.userStockHolding.findMany({
            where: { userId },
            include: {
                company: true,
            },
            orderBy: {
                buyDate: 'desc',
            },
        });

        return holdings;
    }

    // Buy stock
    static async buyStock(data: {
        userId: string;
        companyId: string;
        quantity: number;
        buyPrice: number;
    }) {
        // Validate company exists
        const company = await CompanyService.getCompanyById(data.companyId);

        // Check if user already has holdings for this company
        const existingHolding = await prisma.userStockHolding.findFirst({
            where: {
                userId: data.userId,
                companyId: data.companyId,
            },
        });

        if (existingHolding) {
            // Update existing holding (average price calculation)
            const totalQuantity = existingHolding.quantity + data.quantity;
            const totalValue = (existingHolding.buyPrice * existingHolding.quantity) +
                (data.buyPrice * data.quantity);
            const avgPrice = totalValue / totalQuantity;

            const updatedHolding = await prisma.userStockHolding.update({
                where: { id: existingHolding.id },
                data: {
                    quantity: totalQuantity,
                    buyPrice: avgPrice,
                },
                include: {
                    company: true,
                },
            });

            return updatedHolding;
        } else {
            // Create new holding
            const holding = await prisma.userStockHolding.create({
                data: {
                    userId: data.userId,
                    companyId: data.companyId,
                    quantity: data.quantity,
                    buyPrice: data.buyPrice,
                },
                include: {
                    company: true,
                },
            });

            return holding;
        }
    }

    // Sell stock
    static async sellStock(data: {
        userId: string;
        companyId: string;
        quantity: number;
    }) {
        const holding = await prisma.userStockHolding.findFirst({
            where: {
                userId: data.userId,
                companyId: data.companyId,
            },
            include: {
                company: true,
            },
        });

        if (!holding) {
            throw ApiError.notFound('You do not own any shares of this company');
        }

        if (holding.quantity < data.quantity) {
            throw ApiError.badRequest(
                `Insufficient shares. You own ${holding.quantity} shares but trying to sell ${data.quantity}`
            );
        }

        if (holding.quantity === data.quantity) {
            // Sell all shares - delete holding
            await prisma.userStockHolding.delete({
                where: { id: holding.id },
            });

            return null;
        } else {
            // Partial sell - update quantity
            const updatedHolding = await prisma.userStockHolding.update({
                where: { id: holding.id },
                data: {
                    quantity: holding.quantity - data.quantity,
                },
                include: {
                    company: true,
                },
            });

            return updatedHolding;
        }
    }

    // Get portfolio summary
    static async getPortfolioSummary(userId: string) {
        const holdings = await this.getUserHoldings(userId);

        let totalInvested = 0;
        let currentValue = 0;

        holdings.forEach((holding) => {
            const invested = holding.buyPrice * holding.quantity;
            totalInvested += invested;

            // For now, use current price from company (in real app, fetch live prices)
            const current = holding.company.currentPrice * holding.quantity;
            currentValue += current;
        });

        const profitLoss = currentValue - totalInvested;
        const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

        return {
            totalInvested,
            currentValue,
            profitLoss,
            profitLossPercent,
            holdingsCount: holdings.length,
            availableBalance: 100000 - totalInvested, // Sandbox balance
        };
    }

    // Simulate current stock prices (for demo purposes)
    static simulateCurrentPrices(holdings: any[]) {
        const today = new Date().toDateString();
        const prices: Record<string, number> = {};

        holdings.forEach((holding) => {
            // Use deterministic seed based on company ID and date
            const seed = holding.companyId.charCodeAt(0) +
                holding.companyId.charCodeAt(1) +
                new Date().getDate();
            const normalizedSeed = (seed % 100) / 100;

            // Generate price change between -3% to +3%
            const priceChange = (normalizedSeed - 0.5) * 0.06;
            prices[holding.companyId] = holding.buyPrice * (1 + priceChange);
        });

        return prices;
    }
}
