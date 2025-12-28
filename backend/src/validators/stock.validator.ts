'use strict';

import { z } from 'zod';

export const buyStockSchema = z.object({
    body: z.object({
        companyId: z.string().uuid('Invalid company ID'),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
        buyPrice: z.number().positive('Buy price must be positive'),
    }),
});

export const sellStockSchema = z.object({
    body: z.object({
        companyId: z.string().uuid('Invalid company ID'),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
    }),
});
