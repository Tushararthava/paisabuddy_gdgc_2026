'use strict';

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.use(authLimiter);

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/google', AuthController.googleAuthUrl);
router.post('/google/callback', AuthController.googleCallback);

router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;
