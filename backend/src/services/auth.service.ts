'use strict';

import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JWTPayload } from '../types';
import prisma from '../config/database';
import { ApiError } from '../utils/response.util';
import axios from 'axios';
import bcrypt from 'bcrypt';

interface GoogleUserInfo {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

export class AuthService {
    static generateAccessToken(userId: string, email: string): string {
        const payload: JWTPayload = {
            userId,
            email,
            type: 'access',
        };

        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        } as jwt.SignOptions);
    }

    static generateRefreshToken(userId: string, email: string): string {
        const payload: JWTPayload = {
            userId,
            email,
            type: 'refresh',
        };

        return jwt.sign(payload, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshExpiresIn,
        } as jwt.SignOptions);
    }

    static async refreshAccessToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;

            if (decoded.type !== 'refresh') {
                throw ApiError.unauthorized('Invalid token type');
            }

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user) {
                throw ApiError.unauthorized('User not found');
            }

            const accessToken = this.generateAccessToken(user.id, user.email);
            return { accessToken, user };
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw ApiError.unauthorized('Invalid refresh token');
            }
            throw error;
        }
    }

    static async getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
        try {
            const response = await axios.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            throw ApiError.unauthorized('Failed to get Google user info');
        }
    }

    static async handleGoogleAuth(googleUser: GoogleUserInfo) {
        let user = await prisma.user.findUnique({
            where: { email: googleUser.email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    googleId: googleUser.id,
                    avatar: googleUser.picture,
                },
            });
        } else {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    googleId: googleUser.id,
                    avatar: googleUser.picture,
                    name: googleUser.name,
                },
            });
        }

        const accessToken = this.generateAccessToken(user.id, user.email);
        const refreshToken = this.generateRefreshToken(user.id, user.email);

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    static async register(data: any) {
        const { email, password, name } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw ApiError.badRequest('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const accessToken = this.generateAccessToken(user.id, user.email);
        const refreshToken = this.generateRefreshToken(user.id, user.email);

        return { user, accessToken, refreshToken };
    }

    static async login(data: any) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            throw ApiError.unauthorized('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw ApiError.unauthorized('Invalid credentials');
        }

        const accessToken = this.generateAccessToken(user.id, user.email);
        const refreshToken = this.generateRefreshToken(user.id, user.email);

        return { user, accessToken, refreshToken };
    }
}

