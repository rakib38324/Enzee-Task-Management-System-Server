"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const contact_validation_1 = require("./contact.validation");
const contact_controller_1 = require("./contact.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const router = express_1.default.Router();
router.post('/create-contact', (0, validateRequest_1.default)(contact_validation_1.ContactValidations.createContactValidationSchema), contact_controller_1.ContactControllers.createContact);
router.get('/', (0, Auth_1.default)('admin', 'superAdmin'), contact_controller_1.ContactControllers.getAllContacts);
exports.contactRouter = router;
