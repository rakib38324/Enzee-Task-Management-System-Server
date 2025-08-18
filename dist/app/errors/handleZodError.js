"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const errorDetails = error.issues.map((issue) => {
        return `${issue === null || issue === void 0 ? void 0 : issue.message}`;
    });
    const errorMessage = errorDetails.join(' ');
    return {
        message: 'Validation Error',
        errorMessage,
    };
};
exports.default = handleZodError;
