'use strict';

import { ApiResponse } from '../types';

export class ApiSuccess {
    static send<T>(res: any, data: T, message?: string, statusCode = 200) {
        const response: ApiResponse<T> = {
            success: true,
            data,
            message,
        };
        return res.status(statusCode).json(response);
    }

    static created<T>(res: any, data: T, message = 'Resource created successfully') {
        return this.send(res, data, message, 201);
    }

    static noContent(res: any, message = 'Operation successful') {
        const response: ApiResponse = {
            success: true,
            message,
        };
        return res.status(204).json(response);
    }
}

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public errors?: Record<string, string[]>
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Bad request', errors?: Record<string, string[]>) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = 'Unauthorized') {
        return new ApiError(401, message);
    }

    static forbidden(message = 'Forbidden') {
        return new ApiError(403, message);
    }

    static notFound(message = 'Resource not found') {
        return new ApiError(404, message);
    }

    static conflict(message = 'Resource already exists') {
        return new ApiError(409, message);
    }

    static internal(message = 'Internal server error') {
        return new ApiError(500, message);
    }
}
