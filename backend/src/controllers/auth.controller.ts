'use strict';

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiSuccess, ApiError } from '../utils/response.util';
import { config } from '../config';

export class AuthController {
    static async googleCallback(req: Request, res: Response, next: NextFunction) {
        try {
            const { access_token } = req.body;

            if (!access_token) {
                throw ApiError.badRequest('Access token is required');
            }

            const googleUser = await AuthService.getGoogleUserInfo(access_token);

            const { user, accessToken, refreshToken } = await AuthService.handleGoogleAuth(googleUser);

            return ApiSuccess.send(res, {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                },
                accessToken,
                refreshToken,
            }, 'Login successful');
        } catch (error) {
            next(error);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                throw ApiError.badRequest('Refresh token is required');
            }

            const { accessToken, user } = await AuthService.refreshAccessToken(refreshToken);

            return ApiSuccess.send(res, {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                },
            }, 'Token refreshed successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw ApiError.unauthorized('Not authenticated');
            }

            return ApiSuccess.send(res, {
                user: req.user,
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            return ApiSuccess.send(res, null, 'Logged out successfully');
        } catch (error) {
            next(error);
        }
    }

    static async googleAuthUrl(req: Request, res: Response, next: NextFunction) {
        try {
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${config.google.clientId}&` +
                `redirect_uri=${config.google.callbackUrl}&` +
                `response_type=code&` +
                `scope=openid%20email%20profile&` +
                `access_type=offline&` +
                `prompt=consent`;

            return ApiSuccess.send(res, { authUrl });
        } catch (error) {
            next(error);
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                throw ApiError.badRequest('Email, password, and name are required');
            }
            const result = await AuthService.register({ email, password, name });
            return ApiSuccess.send(res, result, 'Registration successful');
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw ApiError.badRequest('Email and password are required');
            }
            const result = await AuthService.login({ email, password });
            return ApiSuccess.send(res, result, 'Login successful');
        } catch (error) {
            next(error);
        }
    }
}
