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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../errors/appError"));
const config_1 = __importDefault(require("../config/config"));
const userRegistration_model_1 = require("../models/UsersRegistration/userRegistration.model");
const Auth = () => {
    return (0, catchAsync_1.default)((req, response, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not Authorized');
        }
        // invalid token - synchronous
        //===> check the if the token valid
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Unauthorized');
        }
        const { name, email, iat } = decoded;
        //===>check if the user is exists
        const isUserExists = yield userRegistration_model_1.User.findOne({ email: email }).select('+passwordChangedAt');
        if (!isUserExists) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'This user not found!');
        }
        if (isUserExists.passwordChangedAt &&
            userRegistration_model_1.User.isJWTIssuedBeforePasswordChanged(isUserExists.passwordChangedAt, iat)) {
            throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not Authorized');
        }
        req.user = decoded;
        next();
    }));
};
exports.default = Auth;
