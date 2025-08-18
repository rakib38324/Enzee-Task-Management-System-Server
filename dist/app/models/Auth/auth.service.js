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
exports.AuthServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendEmail_1 = require("../../utils/sendEmail");
const emailVerification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, token } = payload;
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ email: email });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Invalid User Information, Please create your account again.');
    }
    //====> verify token
    const decoded = (0, auth_utils_1.VerifyToken)(token, config_1.default.jwt_access_secret);
    // console.log(decoded)
    if (decoded.email !== payload.email) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, `Invalid User Information, try again later.`);
    }
    yield userRegistration_model_1.User.findOneAndUpdate({
        email: email,
    }, {
        verified: true,
    });
    return { message: 'Email Verify Successfully.' };
});
const resendEmailVerification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ email: email });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Invalid User Information, Please create your account.');
    }
    if (isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.verified) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Your email already verified.');
    }
    const jwtPayload = {
        email,
        name: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name,
        _id: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists._id,
    };
    //===========> create token and sent to the client
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '20m');
    const resetUILink = `${config_1.default.email_vErification_ui_link}?email=${email}&token=${resetToken}`;
    const subject = 'Verification email from Enzee Task Management System.';
    const html = `
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background-color: rgb(246, 246, 246); text-align: center; padding: 20px;">
      <h1 style="font-size: 24px; margin-bottom: 15px;">Enzee Task Management System</h1>
    </div>

    <!-- Body -->
    <div style="padding: 20px; color: #333333;">
      <h1 style="font-size: 20px; margin-bottom: 15px;">Dear ${isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name},</h1>
      <p style="line-height: 1.6; margin-bottom: 20px;">
        Thank you for registering with us! To complete your registration, please verify your email address by clicking the button below:
      </p>
      <p style="text-align: center; margin-bottom: 20px;">
        <a href="${resetUILink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #3a2e5c; border-radius: 5px; text-decoration: none;">Verify Email</a>
      </p>
      <p style="line-height: 1.6; margin-bottom: 20px;">
        This verification link is valid for <b>20 minutes</b>. Please do not share this link with anyone.
      </p>
      <p style="line-height: 1.6;">
        If you did not create an account using this email address, you can safely ignore this message.
      </p>
      <p style="margin-top: 20px;">Best regards,<br />The Enzee Task Management Team</p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #888888;">
      <p style="margin: 0;">Enzee Task Management Services</p>
      <p style="margin: 10px 0;">
        <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Privacy Policy</a> | 
        <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Terms of Service</a> | 
        <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Help Center</a>
      </p>
    </div>
  </div>
</body>

  `;
    (0, sendEmail_1.sendEmail)(subject, email, html);
    return {
        message: `Successfully Resend your verification link with ${email}. Please Check Your Email.`,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ email: payload.email });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found! Check your email.');
    }
    ///====> checking if the password is correct
    const isPasswordMatch = yield userRegistration_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password);
    if (!isPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Incorrect password!');
    }
    if (!(isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.verified)) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not verified. Please verify your account.');
    }
    //-====> access granted: send accessToken, RefreshToken
    const jwtPayload = {
        _id: isUserExists._id,
        name: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name,
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
    };
    //===========> create token and sent to the client
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //===========> create refresh token and sent to the client
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_access_expires_in);
    const userInformation = yield userRegistration_model_1.User.findOne({ email: payload.email })
        .select('-password -createdAt -updatedAt -passwordChangedAt') // Exclude password, createdAt, and updatedAt from the User document
        .exec();
    return {
        user: userInformation,
        token: accessToken,
        refreshToken: refreshToken,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ phone: userData.phone });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'This user not found!');
    }
    const currentPassword = payload === null || payload === void 0 ? void 0 : payload.currentPassword;
    const hashpassword = isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password;
    ///====> checking if the given password and exists password is correct
    const isPasswordMatch = yield userRegistration_model_1.User.isPasswordMatched(currentPassword, hashpassword);
    if (!isPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Incorrect password!');
    }
    // ===> hash new password
    const newHasedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield userRegistration_model_1.User.findOneAndUpdate({
        phone: userData.phone,
    }, {
        password: newHasedPassword,
        passwordChangedAt: new Date(),
    });
    return null;
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield userRegistration_model_1.User.findOne({ email: email });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'No Account found. Please check your email.');
    }
    const jwtPayload = {
        _id: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists._id,
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
        name: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name,
    };
    //===========> create token and sent to the client
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '20m');
    const resetUILink = `${config_1.default.reset_password_ui_link}?email=${isUserExists.email}&token=${resetToken}`;
    const subject = 'Password Reset Link From Enzee Task Management System.';
    const html = `
   <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color:rgb(246, 246, 246); text-align: center; padding: 20px;">
            <h1 style="font-size: 24px; margin-bottom: 15px;">Enzee Task Management System</h1>
        </div>
        <!-- Body -->
        <div style="padding: 20px; color: #333333;">
            <h1 style="font-size: 20px; margin-bottom: 15px;">Dear ${isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name},</h1>
            <p style="line-height: 1.6; margin-bottom: 20px;">We received a request to reset your password. To proceed, please click the button below:</p>
            <p style="text-align: center; margin-bottom: 20px;">
                <a href="${resetUILink}"  style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #3a2e5c; border-radius: 5px; text-decoration: none;">Reset Passowrd</a>
            </p>
            <p style="line-height: 1.6;">If you did not request a password reset, please ignore this email. Your account will remain secure.</p>
            <p style="margin-top: 20px;">Best regards,<br>The Enzee Task Management Team.</p>
        </div>
        <!-- Footer -->
        <div style="text-align: center; background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #888888;">
            <p style="margin: 0;">Enzee Task Managementcare Services</p>
            <p style="margin: 10px 0;">
                <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Privacy Policy</a> | 
                <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Terms of Service</a> | 
                <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Help Center</a>
            </p>
        </div>
    </div>
</body>
  `;
    (0, sendEmail_1.sendEmail)(subject, isUserExists.email, html);
    return `Reset link sent your email: ${isUserExists.email}`;
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield userRegistration_model_1.User.findOne({ email: payload.email });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'This user not found!');
    }
    //====> verify token
    const decoded = (0, auth_utils_1.VerifyToken)(token, config_1.default.jwt_access_secret);
    // console.log(decoded)
    if (decoded.email !== payload.email) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, `You are forbidden!!`);
    }
    ///===> hash new password
    const newHasedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield userRegistration_model_1.User.findOneAndUpdate({
        email: decoded.email,
    }, {
        password: newHasedPassword,
        passwordChangedAt: new Date(),
    }, {
        new: true,
        runValidators: true,
    });
    return 'Your Password Changed Successfully';
});
exports.AuthServices = {
    emailVerification,
    resendEmailVerification,
    loginUser,
    changePassword,
    forgetPassword,
    resetPassword,
};
