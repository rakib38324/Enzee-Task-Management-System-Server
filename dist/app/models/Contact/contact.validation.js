"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidations = void 0;
const zod_1 = require("zod");
const createContactValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().nonempty({ message: 'First name is required' }),
        lastName: zod_1.z.string().nonempty({ message: 'Last name is required' }),
        email: zod_1.z.string().email({ message: 'Invalid email address' }),
        country: zod_1.z.string().nonempty({ message: 'Country is required' }),
        reason: zod_1.z.string().nonempty({ message: 'Reason is required' }),
        message: zod_1.z.string().nonempty({ message: 'Message is required' }),
        phone: zod_1.z.string().nonempty({ message: 'Message is required' }),
    }),
});
exports.ContactValidations = {
    createContactValidationSchema,
};
