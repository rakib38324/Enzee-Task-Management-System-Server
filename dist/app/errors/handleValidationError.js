"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (error) => {
    const errorDetails = Object.values(error.errors).map((val) => {
        return `${val === null || val === void 0 ? void 0 : val.path}: ${val === null || val === void 0 ? void 0 : val.message}`;
    });
    const errorMessage = errorDetails.join(' ');
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorMessage,
    };
};
exports.default = handleValidationError;
