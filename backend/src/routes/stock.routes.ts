'use strict';

import { Router } from 'express';
import { StockController } from '../controllers/stock.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { buyStockSchema, sellStockSchema } from '../validators/stock.validator';
import { tradingLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// All stock routes require authentication
router.use(authenticate);

// Get user holdings
router.get('/holdings', StockController.getHoldings);

// Get portfolio summary
router.get('/portfolio', StockController.getPortfolioSummary);

// Buy stock (with rate limiting and validation)
router.post('/buy', tradingLimiter, validate(buyStockSchema), StockController.buyStock);

// Sell stock (with rate limiting and validation)
router.post('/sell', tradingLimiter, validate(sellStockSchema), StockController.sellStock);

export default router;
