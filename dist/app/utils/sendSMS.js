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
exports.verifyCode = exports.sendVerificationCode = void 0;
const twilio_1 = __importDefault(require("twilio"));
const config_1 = __importDefault(require("../config/config"));
const client = (0, twilio_1.default)(config_1.default.sms_account_sid, config_1.default.sms_auth_token);
const sendVerificationCode = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verification = yield client.verify.v2
            .services('VAcc536e4dad98cf11b2dfd80e299cdac6')
            // .services('VAcfaf083b677696d759de7dfde0b6da78')
            .verifications.create({ to: phoneNumber, channel: 'sms' });
        return { success: true, serviceSid: verification.serviceSid };
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error sending verification code',
            error: error,
        };
    }
});
exports.sendVerificationCode = sendVerificationCode;
// Function to verify the code entered by the user
const verifyCode = (phone, code, verifyServiceSid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verificationCheck = yield client.verify.v2
            .services(verifyServiceSid)
            .verificationChecks.create({ to: phone, code });
        //   console.log('Verification Status:', verificationCheck.status);
        if (verificationCheck.status === 'approved') {
            return { success: true, message: 'Phone number verified successfully.' };
        }
        else {
            return { success: false, message: 'Invalid verification code.' };
        }
    }
    catch (error) {
        return {
            success: false,
            message: 'Invalid verification code.',
            error: error,
        };
    }
});
exports.verifyCode = verifyCode;
