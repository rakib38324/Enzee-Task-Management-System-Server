"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
// Feedback Subdocument Schema
const feedbackSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
}, { _id: false } // Don't create separate _id for each feedback entry
);
const courseSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Categorie', required: true },
    price: { type: Number, required: true },
    level: { type: String, required: true },
    instructor: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    duration: { type: String, required: true },
    image: { type: String },
    rating: { type: Number },
    feedback: [feedbackSchema],
    students: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false }],
    language: { type: String },
    published: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
