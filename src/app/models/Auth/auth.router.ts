import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { authControllers } from './auth.controller';
import Auth from '../../middlewares/Auth';

const router = express.Router();

router.post(
  '/email-verification',
  ValidateRequest(authValidations.emailValidationSchema),
  authControllers.emailVerification,
);

router.post(
  '/resend-email-verification',
  ValidateRequest(authValidations.resendEmailValidationSchema),
  authControllers.resendEmailVerification,
);

router.post(
  '/login',
  ValidateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser,
);

router.post(
  '/change-password',
  Auth(),
  ValidateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword,
);

router.post(
  '/forget-password',
  ValidateRequest(authValidations.forgetPasswordValidationSchema),
  authControllers.forgetPassword,
);

router.post(
  '/reset-password',
  Auth(),
  ValidateRequest(authValidations.resetPasswordValidationSchema),
  authControllers.resetPassword,
);

export const loginRouters = router;
