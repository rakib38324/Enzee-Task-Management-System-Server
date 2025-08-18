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
const config_1 = __importDefault(require("../config/config"));
const user_constent_1 = require("../models/UsersRegistration/user.constent");
const userRegistration_model_1 = require("../models/UsersRegistration/userRegistration.model");
const superUser = {
    firstName: 'You are Supper',
    lastName: 'Admin',
    phone: '+880123456789',
    email: 'admin12@gmail.com',
    password: config_1.default.super_admin_password,
    role: user_constent_1.USER_ROLE.superAdmin,
    verified: true,
    userType: 'Member',
    status: 'Active',
    address: 'ABC DEF, City, Country.',
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    // when database is connected, we will check is there any user who is super admin
    const isSuperAdminExists = yield userRegistration_model_1.User.findOne({ role: user_constent_1.USER_ROLE.superAdmin });
    if (!isSuperAdminExists) {
        yield userRegistration_model_1.User.create(superUser);
    }
});
exports.default = seedSuperAdmin;
