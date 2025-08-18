"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (error) => {
    var _a;
    const id_Array = (_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.match(/"([^"]+)"/);
    const id_numbers = id_Array ? id_Array[1] : '';
    const errorMessage = `${id_numbers} is not a valid ID!`;
    const statusCode = 400;
    return {
        statusCode,
        message: 'Invalid ID.',
        errorMessage,
    };
};
exports.default = handleCastError;
