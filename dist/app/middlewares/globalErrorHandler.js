"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const appError_1 = __importDefault(require("../errors/appError"));
const unauthorizedError_1 = __importDefault(require("../errors/unauthorizedError"));
const config_1 = __importDefault(require("../config/config"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Errors!!!';
    let errorMessage = 'Something went wrong!';
    let errorDetails = null; // Initialize as null directly
    if (error instanceof zod_1.ZodError) {
        statusCode = 400;
        const ZodMessage = (0, handleZodError_1.default)(error);
        message = ZodMessage.message;
        errorMessage = ZodMessage.errorMessage;
        errorDetails = error;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
        const validationError = (0, handleValidationError_1.default)(error);
        statusCode = 400;
        message = validationError === null || validationError === void 0 ? void 0 : validationError.message;
        errorMessage = validationError === null || validationError === void 0 ? void 0 : validationError.errorMessage;
        errorDetails = error;
    }
    else if (error.name === 'CastError') {
        const CastError = (0, handleCastError_1.default)(error);
        statusCode = 400;
        message = CastError === null || CastError === void 0 ? void 0 : CastError.message;
        errorMessage = CastError === null || CastError === void 0 ? void 0 : CastError.errorMessage;
        errorDetails = error;
    }
    else if (error.code === 11000) {
        const errorData = (0, handleDuplicateError_1.default)(error);
        statusCode = errorData === null || errorData === void 0 ? void 0 : errorData.statusCode;
        message = errorData === null || errorData === void 0 ? void 0 : errorData.message;
        errorMessage = errorData.errorSources;
        errorDetails = error;
    }
    else if (error instanceof appError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = 'Error';
        errorMessage = error === null || error === void 0 ? void 0 : error.message;
        errorDetails = error;
    }
    else if (error instanceof unauthorizedError_1.default) {
        message = 'Unauthorized Access';
        errorMessage = error === null || error === void 0 ? void 0 : error.message;
        errorDetails = null;
    }
    else if (error.name === 'JsonWebTokenError') {
        message = 'Unauthorized Access';
        errorMessage =
            'You do not have the necessary permissions to access this resource.';
        errorDetails = null;
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.name;
        errorMessage = error === null || error === void 0 ? void 0 : error.message;
        errorDetails = error;
    }
    // Ensure we don't return a response directly, but send it to the client
    res.status(statusCode).json({
        success: false,
        message,
        errorMessage,
        errorDetails,
        stack: config_1.default.NODE_ENV === 'development' ? error === null || error === void 0 ? void 0 : error.stack : null,
    });
    // Don't return anything (no explicit return)
};
exports.default = globalErrorHandler;
