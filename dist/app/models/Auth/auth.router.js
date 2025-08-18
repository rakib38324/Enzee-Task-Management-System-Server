"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouters = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const router = express_1.default.Router();
router.post('/email-verification', (0, validateRequest_1.default)(auth_validation_1.authValidations.emailValidationSchema), auth_controller_1.authControllers.emailVerification);
router.post('/resend-email-verification', (0, validateRequest_1.default)(auth_validation_1.authValidations.resendEmailValidationSchema), auth_controller_1.authControllers.resendEmailVerification);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.authValidations.loginValidationSchema), auth_controller_1.authControllers.loginUser);
router.post('/change-password', (0, Auth_1.default)(), (0, validateRequest_1.default)(auth_validation_1.authValidations.changePasswordValidationSchema), auth_controller_1.authControllers.changePassword);
router.post('/forget-password', (0, validateRequest_1.default)(auth_validation_1.authValidations.forgetPasswordValidationSchema), auth_controller_1.authControllers.forgetPassword);
router.post('/reset-password', (0, Auth_1.default)(), (0, validateRequest_1.default)(auth_validation_1.authValidations.resetPasswordValidationSchema), auth_controller_1.authControllers.resetPassword);
exports.loginRouters = router;
