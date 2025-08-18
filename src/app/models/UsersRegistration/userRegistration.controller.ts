import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { UserServices } from './userRegistration.service';

const createUsers = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration completed successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Information Retrieved Successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Information Retrieved Successfully',
    data: result,
  });
});

const updateUsers = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserFromDB(id, req.file, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserServices.getMeFromDB(email);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Your Information Retrieved Successfully`,
    data: result,
  });
});

export const userControllers = {
  createUsers,
  getSingleUser,
  getAllUsers,
  updateUsers,
  getMe,
};
