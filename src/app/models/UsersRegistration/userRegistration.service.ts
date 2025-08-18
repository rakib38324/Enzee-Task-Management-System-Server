/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { TUser } from './userRegistration.interface';
import AppError from '../../errors/appError';
import { User } from './userRegistration.model';
import { createToken, TJwtPayload } from '../Auth/auth.utils';
import config from '../../config/config';
import { sendEmail } from '../../utils/sendEmail';
import bcrypt from 'bcrypt';

//  ===> Create a new user in the database
//  ===> This function will create a new user and return the user information along with access
const createUserIntoDB = async (payload: TUser) => {
  const userExists = await User.findOne({ email: payload?.email });

  if (userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This email already exists! Please try with another email.',
    );
  }

  if (!payload.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Password is required. Please provide a password.',
    );
  }

  const userInfo = {
    ...payload,
    passwordChangedAt: new Date(),
  };

  const user = await User.create(userInfo);

  const jwtPayload: TJwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  //===========> create token and sent to the client
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '20m',
  );

  const resetUILink = `${config.email_vErification_ui_link}?email=${user?.email}&token=${resetToken}`;
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
            <h1 style="font-size: 20px; margin-bottom: 15px;">Dear ${user?.name},</h1>
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

  sendEmail(subject, user?.email, html);

  return {
    name: user.name,
    email: user.email,
  };
};

//  ===> Get all users from the database
//  ===> This function will return all users information from the database
//  ===> It will not return the password field
const getAllUserFromDB = async () => {
  const userExists = await User.find().select('-password');
  return userExists;
};

//  ===> Get single user from the database
//  ===> This function will return single user information from the database
//  ===> It will not return the password field
const getSingleUserFromDB = async (_id: string) => {
  const result = await User.findById({ _id }).select('-password');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Information is not found.');
  }
  return result;
};

//  ===> Get user information from the database
//  ===> This function will return user information from the database
//  ===> It will not return the password field
const getMeFromDB = async (email: string) => {
  const userExists = await User.findOne({ email: email }).select('-password');

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Information is not found.');
  }
  return userExists;
};

// ===> Update user information in the database
const updateUserFromDB = async (
  _id: string,
  file: any,
  payload: Partial<TUser>,
) => {
  const userExists = await User.findById({ _id });
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Information is not found.');
  }

  // ====> If the user is trying to update the email, check if the new email already exists
  if (payload?.email != userExists?.email) {
    const existEmail = await User.findOne({ email: payload?.email });
    if (existEmail) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'This email already exists! Please try with another email.',
      );
    }
  }

  const result = await User.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  }).select('-password');

  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  getMeFromDB,
};
