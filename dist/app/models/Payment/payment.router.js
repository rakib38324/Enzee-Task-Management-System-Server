"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const payment_controller_1 = require("./payment.controller");
const payment_validation_1 = require("./payment.validation");
const router = express_1.default.Router();
router.post('/create-payment', (0, Auth_1.default)('admin', 'superAdmin', 'user'), (0, validateRequest_1.default)(payment_validation_1.PaymentValidations.createPaymentValidationSchema), payment_controller_1.PaymentControllers.createPayment);
exports.PaymentRouter = router;
