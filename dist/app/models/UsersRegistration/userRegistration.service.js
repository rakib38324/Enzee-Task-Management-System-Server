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
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("./userRegistration.model");
const auth_utils_1 = require("../Auth/auth.utils");
const config_1 = __importDefault(require("../../config/config"));
const sendEmail_1 = require("../../utils/sendEmail");
//  ===> Create a new user in the database
//  ===> This function will create a new user and return the user information along with access
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'This email already exists! Please try with another email.');
    }
    if (!payload.password) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Password is required. Please provide a password.');
    }
    const userInfo = Object.assign(Object.assign({}, payload), { passwordChangedAt: new Date() });
    const user = yield userRegistration_model_1.User.create(userInfo);
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
    };
    //===========> create token and sent to the client
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '20m');
    const resetUILink = `${config_1.default.email_vErification_ui_link}?email=${user === null || user === void 0 ? void 0 : user.email}&token=${resetToken}`;
    const subject = 'Verification email from Enzee Tasks Management System.';
    const html = `
   <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color:rgb(246, 246, 246); text-align: center;font-size: 20px; padding: 20px;">
            
            <h1 style="font-size: 24px; margin-bottom: 15px;">Enzee Tasks Management System</h1>
        </div>
        <!-- Body -->
        <div style="padding: 20px; color: #333333;">
            <h1 style="font-size: 20px; margin-bottom: 15px;">Dear ${user === null || user === void 0 ? void 0 : user.name},</h1>
            <p style="line-height: 1.6; margin-bottom: 20px;">Thank you for signing up with us! To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center; margin-bottom: 20px;">
                <a href="${resetUILink}"  style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #3a2e5c; border-radius: 5px; text-decoration: none;">Verify Email</a>
            </p>
            <p style="line-height: 1.6;">If you did not sign up for this account, please ignore this email.</p>
            <p style="margin-top: 20px;">Best regards,<br>The Enzee Tasks Management System.</p>
        </div>
        <!-- Footer -->
        <div style="text-align: center; background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #888888;">
            <p style="margin: 0;">Enzee Task Management</p>
            <p style="margin: 10px 0;">
                <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Privacy Policy</a> | 
                <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Terms of Service</a> | 
                <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Help Center</a>
            </p>
        </div>
    </div>
</body>
  `;
    (0, sendEmail_1.sendEmail)(subject, user === null || user === void 0 ? void 0 : user.email, html);
    return {
        name: user.name,
        email: user.email,
    };
});
//  ===> Get all users from the database
//  ===> This function will return all users information from the database
//  ===> It will not return the password field
const getAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.find().select('-password');
    return userExists;
});
//  ===> Get single user from the database
//  ===> This function will return single user information from the database
//  ===> It will not return the password field
const getSingleUserFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userRegistration_model_1.User.findById({ _id }).select('-password');
    if (!result) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'User Information is not found.');
    }
    return result;
});
//  ===> Get user information from the database
//  ===> This function will return user information from the database
//  ===> It will not return the password field
const getMeFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findOne({ email: email }).select('-password');
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'User Information is not found.');
    }
    return userExists;
});
// ===> Update user information in the database
const updateUserFromDB = (_id, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById({ _id });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'User Information is not found.');
    }
    // ====> If the user is trying to update the email, check if the new email already exists
    if ((payload === null || payload === void 0 ? void 0 : payload.email) != (userExists === null || userExists === void 0 ? void 0 : userExists.email)) {
        const existEmail = yield userRegistration_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
        if (existEmail) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'This email already exists! Please try with another email.');
        }
    }
    const result = yield userRegistration_model_1.User.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    }).select('-password');
    return result;
});
exports.UserServices = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    updateUserFromDB,
    getMeFromDB,
};
