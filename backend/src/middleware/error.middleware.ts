'use strict';

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/response.util';
import { logger } from '../config/logger';
import { ApiResponse } from '../types';

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    if (err instanceof ApiError) {
        const response: ApiResponse = {
            success: false,
            error: err.message,
            errors: err.errors,
        };
        return res.status(err.statusCode).json(response);
    }

    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const response: ApiResponse = {
            success: false,
            error: 'Database operation failed',
        };
        return res.status(400).json(response);
    }

    // Handle validation errors
    if (err.name === 'ZodError') {
        const response: ApiResponse = {
            success: false,
            error: 'Validation failed',
        };
        return res.status(400).json(response);
    }

    // Default error
    const response: ApiResponse = {
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    };

    return res.status(500).json(response);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
    const response: ApiResponse = {
        success: false,
        error: `Route ${req.originalUrl} not found`,
    };
    res.status(404).json(response);
};
