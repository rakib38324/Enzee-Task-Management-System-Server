"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categorie = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String },
    active: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.Categorie = (0, mongoose_1.model)('Categorie', categorySchema);
