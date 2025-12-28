'use strict';

import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/company.service';
import { ApiSuccess } from '../utils/response.util';

export class CompanyController {
    // Get all companies
    static async getAllCompanies(req: Request, res: Response, next: NextFunction) {
        try {
            const { sector, marketCapCategory, search } = req.query;

            const companies = await CompanyService.getAllCompanies({
                sector: sector as string,
                marketCapCategory: marketCapCategory as string,
                search: search as string,
            });

            return ApiSuccess.send(res, { companies });
        } catch (error) {
            next(error);
        }
    }

    // Get company by ID
    static async getCompanyById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const company = await CompanyService.getCompanyById(id);

            return ApiSuccess.send(res, { company });
        } catch (error) {
            next(error);
        }
    }

    // Get company by symbol
    static async getCompanyBySymbol(req: Request, res: Response, next: NextFunction) {
        try {
            const { symbol } = req.params;
            const company = await CompanyService.getCompanyBySymbol(symbol);

            return ApiSuccess.send(res, { company });
        } catch (error) {
            next(error);
        }
    }

    // Get sectors
    static async getSectors(req: Request, res: Response, next: NextFunction) {
        try {
            const sectors = await CompanyService.getSectors();
            return ApiSuccess.send(res, { sectors });
        } catch (error) {
            next(error);
        }
    }

    // Get market cap categories
    static async getMarketCapCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CompanyService.getMarketCapCategories();
            return ApiSuccess.send(res, { categories });
        } catch (error) {
            next(error);
        }
    }
}
