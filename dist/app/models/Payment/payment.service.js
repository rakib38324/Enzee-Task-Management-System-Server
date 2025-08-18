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
exports.PaymentServices = void 0;
const payment_model_1 = require("./payment.model");
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const sendEmail_1 = require("../../utils/sendEmail");
const config_1 = __importDefault(require("../../config/config"));
const createPaymentIntoDB = (userInfo, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createdData = Object.assign(Object.assign({}, payload), { user_id: userInfo === null || userInfo === void 0 ? void 0 : userInfo._id });
    const result = yield payment_model_1.Payment.create(createdData);
    if (result === null || result === void 0 ? void 0 : result._id) {
        const updateUser = {
            subscribetionId: result === null || result === void 0 ? void 0 : result._id,
        };
        yield userRegistration_model_1.User.findByIdAndUpdate({ _id: userInfo === null || userInfo === void 0 ? void 0 : userInfo._id }, updateUser, {
            new: true,
        });
    }
    const subject = 'Payment Confirmation – Your Enzee Task Management Subscription Is Active';
    const html = `
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background-color: #3a2e5c; text-align: center; padding: 20px;">
      <img src="https://i.ibb.co/wRDRjFz/cmd-logo.png" alt="CMD Healthcare Services" style="max-width: 150px; margin-bottom: 10px;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Thank You for Subscribing!</h1>
    </div>

    <!-- Body -->
    <div style="padding: 20px; color: #333333;">
      <h2 style="font-size: 20px; margin-bottom: 15px;">Hello ${result === null || result === void 0 ? void 0 : result.name},</h2>
      <p style="line-height: 1.6; margin-bottom: 20px;">
        We are thrilled to have you as part of our community! Your subscription has been successfully activated. Here are the details of your subscription:
      </p>

      <!-- Payment Details -->
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9; margin-bottom: 20px;">
        <h3 style="font-size: 18px; margin-bottom: 10px; color: #3a2e5c;">Payment Information</h3>
        <p style="line-height: 1.6; margin-bottom: 8px;"><strong>Package Name:</strong> ${result === null || result === void 0 ? void 0 : result.packageType}</p>
        <p style="line-height: 1.6; margin-bottom: 8px;"><strong>Start Date:</strong> ${result === null || result === void 0 ? void 0 : result.packageStartDate}</p>
        <p style="line-height: 1.6; margin-bottom: 8px;"><strong>Expire Date:</strong> ${result === null || result === void 0 ? void 0 : result.packageExpireDate}</p>
        <p style="line-height: 1.6; margin-bottom: 8px;"><strong>Transaction ID:</strong> ${result === null || result === void 0 ? void 0 : result.transaction_id}</p>
        <p style="line-height: 1.6; margin-bottom: 8px;"><strong>Amount Paid:</strong> ${result === null || result === void 0 ? void 0 : result.charged_amount} ${result === null || result === void 0 ? void 0 : result.currency}</p>
      </div>

      <p style="line-height: 1.6; margin-bottom: 20px;">
        Stay tuned for updates, exclusive content, and the latest news from Enzee Task Managements. If you have any questions or need assistance, feel free to contact our support team.
      </p>
      <p style="text-align: center; margin-bottom: 20px;">
        <a href="${process.env.CLIENT_UI_LINK}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #3a2e5c; border-radius: 5px; text-decoration: none;">
          Visit Our Website
        </a>
      </p>
      <p style="line-height: 1.6;">Thank you once again for choosing Enzee Task Managements. We're here to support you every step of the way.</p>
      <p style="margin-top: 20px;">Best regards,<br>The CMD Health Team.</p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #888888;">
      <p style="margin: 0;">CMD Healthcare Services</p>
      <p style="margin: 10px 0;">
        <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Privacy Policy</a> | 
        <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Terms of Service</a> | 
        <a href="#" style="color: #6c5ce7; text-decoration: none; margin: 0 5px;">Help Center</a>
      </p>
    </div>
  </div>
</body>
  `;
    const adminSubject = 'User Registration Notification';
    const adminemail = config_1.default.admin_email;
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    const adminHtml = `
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333; line-height: 1.6;">
    <table style="max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #dddddd; border-radius: 8px; width: 100%;">
      <tr>
        <td style="background: #4CAF50; color: #ffffff; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; border-radius: 8px 8px 0 0;">
          New Subscription
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 10px;">Hello Admin,</p>
          <p style="margin: 0 0 10px;">A new user has subscribed on your platform:</p>
          <p style="margin: 0 0 10px;"><strong>Email:</strong> ${payload.email}</p>
          <p style="margin: 0 0 20px;"><strong>Timestamp:</strong> ${formattedDate}</p>
          
        </td>
      </tr>
      <tr>
        <td style="text-align: center; padding: 10px; background: #f1f1f1; font-size: 12px; color: #777; border-radius: 0 0 8px 8px;">
          This is an automated message. Please do not reply.
        </td>
      </tr>
    </table>
  </body>`;
    (0, sendEmail_1.sendEmail)(subject, result === null || result === void 0 ? void 0 : result.email, html);
    if (adminemail) {
        (0, sendEmail_1.sendEmail)(adminSubject, adminemail, adminHtml);
    }
    return result;
});
exports.PaymentServices = {
    createPaymentIntoDB,
};
