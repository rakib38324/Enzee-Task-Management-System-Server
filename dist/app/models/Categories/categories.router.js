"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouters = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const categories_validation_1 = require("./categories.validation");
const categories_controller_1 = require("./categories.controller");
const router = express_1.default.Router();
router.post('/create-category', (0, Auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(categories_validation_1.categoryValidations.categoryValidationSchema), categories_controller_1.categoryControllers.createCategory);
router.patch('/update-category/:_id', (0, Auth_1.default)('superAdmin', 'admin'), (0, validateRequest_1.default)(categories_validation_1.categoryValidations.categoryValidationSchema), categories_controller_1.categoryControllers.updateCategory);
router.get('/get-all-category', (0, Auth_1.default)('superAdmin', 'admin'), categories_controller_1.categoryControllers.getAllCategory);
router.get('/get-single-category/:_id', (0, Auth_1.default)('superAdmin', 'admin'), categories_controller_1.categoryControllers.getSingleCategory);
router.delete('/delete-category/:_id', (0, Auth_1.default)('superAdmin', 'admin'), categories_controller_1.categoryControllers.categoryDelete);
exports.categoryRouters = router;
