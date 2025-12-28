'use strict';

import { Request, Response, NextFunction } from 'express';
import { StockService } from '../services/stock.service';
import { ApiSuccess } from '../utils/response.util';

export class StockController {
    // Get user holdings
    static async getHoldings(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const holdings = await StockService.getUserHoldings(userId);

            return ApiSuccess.send(res, { holdings });
        } catch (error) {
            next(error);
        }
    }

    // Buy stock
    static async buyStock(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const { companyId, quantity, buyPrice } = req.body;

            const holding = await StockService.buyStock({
                userId,
                companyId,
                quantity,
                buyPrice,
            });

            return ApiSuccess.created(res, { holding }, 'Stock purchased successfully');
        } catch (error) {
            next(error);
        }
    }

    // Sell stock
    static async sellStock(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const { companyId, quantity } = req.body;

            const holding = await StockService.sellStock({
                userId,
                companyId,
                quantity,
            });

            return ApiSuccess.send(
                res,
                { holding },
                holding ? 'Stock sold successfully' : 'All shares sold successfully'
            );
        } catch (error) {
            next(error);
        }
    }

    // Get portfolio summary
    static async getPortfolioSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const summary = await StockService.getPortfolioSummary(userId);

            return ApiSuccess.send(res, { portfolio: summary });
        } catch (error) {
            next(error);
        }
    }
}
