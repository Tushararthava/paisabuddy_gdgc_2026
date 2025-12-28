'use strict';

import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// All company routes can be accessed with optional auth
router.use(optionalAuth);

// Get all companies with optional filters
router.get('/', CompanyController.getAllCompanies);

// Get sectors
router.get('/sectors', CompanyController.getSectors);

// Get market cap categories
router.get('/market-cap-categories', CompanyController.getMarketCapCategories);

// Get company by ID
router.get('/:id', CompanyController.getCompanyById);

// Get company by symbol
router.get('/symbol/:symbol', CompanyController.getCompanyBySymbol);

export default router;
