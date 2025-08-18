"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (error) => {
    const match = error.message.match(/"([^"]*)"/);
    const extracted_msg = match && match[1];
    const errorSources = `Duplicate Information. ${extracted_msg} is already exists!`;
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};
exports.default = handleDuplicateError;
