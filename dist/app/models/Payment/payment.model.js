"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
// Define the Mongoose schema
const PaymentSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    packageStartDate: { type: String, required: true },
    packageExpireDate: { type: String, required: true },
    packageType: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    charged_amount: { type: String, required: true },
    currency: { type: String, required: true },
    payerName: { type: String, required: true },
    payerEmail: { type: String, required: true },
    transaction_id: { type: String, required: true },
    tx_ref: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    street: { type: String },
    zipCode: { type: String },
    country: { type: String },
    dateOfBirth: { type: String },
    bdi: { type: String },
    spouseName: { type: String },
    spouseAge: { type: String },
    childrens: [
        {
            name: { type: String },
            age: { type: Number },
        },
    ],
    husbandName: { type: String },
    wifeName: { type: String },
    companyName: { type: String },
    companyAddress: { type: String },
    companyContactPerson: { type: String },
    companyPhone: { type: String },
    companyEmployeesNumber: { type: Number },
}, { timestamps: true });
// Create and export the model
exports.Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
