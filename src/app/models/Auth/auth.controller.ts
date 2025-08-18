import httpStatus from 'http-status-codes';
import config from '../../config/config';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { AuthServices } from './auth.service';

const emailVerification = catchAsync(async (req, res) => {
  const result = await AuthServices.emailVerification(req.body);
  const { message } = result;

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: message,
    data: null,
  });
});

const resendEmailVerification = catchAsync(async (req, res) => {
  const result = await AuthServices.resendEmailVerification(req.body);
  const { message } = result;

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: message,
    data: null,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, token, user } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login Successfully!',
    data: { user, token },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Change Successfully',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;

  const result = await AuthServices.forgetPassword(email);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Please check your email to reset your password.',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthServices.resetPassword(req.body, token as string);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is reset Successfully',
    data: result,
  });
});

export const authControllers = {
  emailVerification,
  resendEmailVerification,
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
};
