'use strict';

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/response.util';
import { JWTPayload } from '../types';
import prisma from '../config/database';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No token provided');
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

        if (decoded.type !== 'access') {
            throw ApiError.unauthorized('Invalid token type');
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        if (!user) {
            throw ApiError.unauthorized('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(ApiError.unauthorized('Invalid token'));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(ApiError.unauthorized('Token expired'));
        } else {
            next(error);
        }
    }
};

export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

        if (decoded.type === 'access') {
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });

            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        next();
    }
};
