"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const userRegistration_validation_1 = require("./userRegistration.validation");
const userRegistration_controller_1 = require("./userRegistration.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const router = express_1.default.Router();
router.post('/user-registration', userRegistration_controller_1.userControllers.createUsers);
router.get('/get-me', (0, Auth_1.default)(), userRegistration_controller_1.userControllers.getMe);
router.get('/', (0, Auth_1.default)(), userRegistration_controller_1.userControllers.getAllUsers);
router.get('/:id', (0, Auth_1.default)(), userRegistration_controller_1.userControllers.getSingleUser);
router.patch('/update-user/:id', (0, Auth_1.default)(), (0, validateRequest_1.default)(userRegistration_validation_1.UserValidations.updateUserValidationSchema), userRegistration_controller_1.userControllers.updateUsers);
exports.userRouter = router;
