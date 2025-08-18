"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidations = void 0;
const zod_1 = require("zod");
const createPaymentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        packageStartDate: zod_1.z.string({
            required_error: 'Package start date is required',
        }),
        packageExpireDate: zod_1.z.string({
            required_error: 'Package expire date is required',
        }),
        packageType: zod_1.z.string({ required_error: 'packageType is required' }),
        email: zod_1.z.string().email('Invalid email address'),
        name: zod_1.z.string({ required_error: 'Name is required' }),
        phone_number: zod_1.z.string({ required_error: 'Phone number is required' }),
        charged_amount: zod_1.z.string(),
        currency: zod_1.z.string({ required_error: 'Currency is required' }),
        transaction_id: zod_1.z.string({ required_error: 'Transaction ID is required' }),
        tx_ref: zod_1.z.string({ required_error: 'Transaction reference is required' }),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        street: zod_1.z.string().optional(),
        zipCode: zod_1.z.string().optional(),
        country: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z.string().optional(),
        bdi: zod_1.z.string().optional(),
        spouseName: zod_1.z.string().optional(),
        spouseAge: zod_1.z.number().optional(),
        companyName: zod_1.z.string().optional(),
        companyAddress: zod_1.z.string().optional(),
        companyContactPerson: zod_1.z.string().optional(),
        companyPhone: zod_1.z.string().optional(),
        companyEmployeesNumber: zod_1.z
            .number()
            .min(50, 'Number of employees must be at least 50')
            .optional(),
    }),
});
exports.PaymentValidations = {
    createPaymentValidationSchema,
};
