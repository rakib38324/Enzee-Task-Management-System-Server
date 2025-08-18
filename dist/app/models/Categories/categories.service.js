"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryServices = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const categories_model_1 = require("./categories.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const categoryCreateIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryExists = yield categories_model_1.Categorie.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
    if (categoryExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Category already exists! Duplicate Category Name.');
    }
    const result = yield categories_model_1.Categorie.create(payload);
    return result;
});
const updateCategoryIntoDB = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryExists = yield categories_model_1.Categorie.findById({ _id });
    if (!categoryExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Category not found!');
    }
    const result = yield categories_model_1.Categorie.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const getAllcategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_model_1.Categorie.find({ active: true }).sort({ createdAt: -1 });
    return result;
});
const getSingleCategoryFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_model_1.Categorie.findById({ _id });
    if (!result) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Category not found!');
    }
    return result;
});
const categoryDeleteFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryExists = yield categories_model_1.Categorie.findById({ _id });
    if (!categoryExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Category not found!');
    }
    if (categoryExists.active) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Category already Active! Thats meaan this category have course.');
    }
    const result = yield categories_model_1.Categorie.findByIdAndUpdate(_id, { active: false }, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.categoryServices = {
    categoryCreateIntoDB,
    updateCategoryIntoDB,
    getAllcategoryFromDB,
    getSingleCategoryFromDB,
    categoryDeleteFromDB,
};
