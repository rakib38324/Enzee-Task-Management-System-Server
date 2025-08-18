"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
// Define the Mongoose schema
const contactSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    reason: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String, required: true },
}, { timestamps: true });
// Create and export the model
exports.Contact = (0, mongoose_1.model)('Contact', contactSchema);
