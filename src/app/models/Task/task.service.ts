/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { TTask } from './task.interface';
import { JwtPayload } from 'jsonwebtoken';
import { Task } from './task.model';
import AppError from '../../errors/appError';
import config from '../../config/config';
import { sendEmail } from '../../utils/sendEmail';

// ===> Create task into the database
// ===> This function will create a new task in the database
const createTaskIntoDB = async (payload: TTask, userData: JwtPayload) => {
  const isExistTask = await Task.findOne({ title: payload.title });
  if (isExistTask) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Task with this title already exists',
    );
  }

  const task_info = {
    ...payload,
    task_created_by: userData._id,
    status: 'pending',
  };

  const task = await Task.create(task_info);

  return task;
};

// get all task from database using user id
const getAllTasksFromDB = async (userId: string) => {
  const tasks = await Task.find({ task_created_by: userId }).populate({
    path: 'task_created_by',
    select: '-password -createdAt -updatedAt -passwordChangedAt',
  });

  return tasks;
};

// get task by id
const getTaskById = async (taskId: string, userId: string) => {
  const taskExists = await Task.findById(taskId)
    .populate({
      path: 'task_created_by',
      select: '-password -createdAt -updatedAt -passwordChangedAt',
    })
    .select('-createdAt -updatedAt'); // for Task model

  if (!taskExists) {
    throw new AppError(httpStatus.FORBIDDEN, 'Task not found');
  }

  if (taskExists.task_created_by._id.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to access this task',
    );
  }

  return taskExists;
};

// update task status
// This function will update the status of a task

const updateTaskStatus = async (
  taskId: string,
  status: string,
  userInfo: JwtPayload,
) => {
  const taskExists = await Task.findById(taskId).populate('task_created_by');
  if (!taskExists) {
    throw new AppError(httpStatus.FORBIDDEN, 'Task not found');
  }

  if (taskExists.task_created_by._id.toString() !== userInfo?._id?.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this task. You can only update tasks you created.',
    );
  }

  if (!['pending', 'in-progress', 'completed'].includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid status. Allowed values are: pending, in-progress, completed',
    );
  }

  if (taskExists.status === status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Task is already in ${status} status`,
    );
  }

  if (status === 'completed' && taskExists.status === 'pending') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Task cannot be marked as completed directly from pending status',
    );
  }

  const updatedTask = await Task.findByIdAndUpdate(
    {
      _id: taskId,
    },
    { status },
    { runValidators: true, new: true },
  );

  if (updatedTask?.status === 'completed') {
    const subject = 'Congratulations! Your Task is Completed';

    const html = `
     <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background-color: rgb(246, 246, 246); text-align: center; font-size: 20px; padding: 20px;">
      <h1 style="font-size: 24px; margin-bottom: 15px;">Enzee Tasks Management System</h1>
    </div>

    <!-- Body -->
    <div style="padding: 20px; color: #333333;">
      <h1 style="font-size: 20px; margin-bottom: 15px;">Dear ${userInfo?.name},</h1>
      <p style="line-height: 1.6; margin-bottom: 20px;">
        Great news! 🎉 Your task <strong>"${updatedTask?.title}"</strong> has been successfully completed.
      </p>
      <p style="text-align: center; margin-bottom: 20px;">
        <a href="${config.client_url_link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #28a745; border-radius: 5px; text-decoration: none;">
          View Completed Task
        </a>
      </p>
      <p style="line-height: 1.6;">Thank you for using Enzee Task Management System to stay productive!</p>
      <p style="margin-top: 20px;">Best regards,<br>The Enzee Tasks Management System Team</p>
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

    sendEmail(subject, userInfo?.email, html);
  }
  return updatedTask;
};

// update task
const updateTask = async (
  taskId: string,
  payload: Partial<TTask>,
  userId: JwtPayload,
) => {
  if (payload.task_created_by) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You cannot update the Task Woner Informations',
    );
  }

  const taskExists = await Task.findById({ _id: taskId });

  if (!taskExists) {
    throw new AppError(httpStatus.FORBIDDEN, 'Task not found');
  }

  if (taskExists.task_created_by._id.toString() !== userId.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this task. You can only update tasks you created.',
    );
  }

  const updatedTask = await Task.findByIdAndUpdate({ _id: taskId }, payload, {
    new: true,
    runValidators: true,
  });
  return updatedTask;
};

// delete task
const deleteTask = async (taskId: string, userId: string) => {
  const taskExists = await Task.findById(taskId);
  if (!taskExists) {
    throw new AppError(httpStatus.FORBIDDEN, 'Task not found');
  }

  if (taskExists.task_created_by.toString() !== userId.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this task, you can only delete tasks you created.',
    );
  }
  const deletedTask = await Task.findByIdAndDelete(taskId);
  return deletedTask;
};

export const TaskServices = {
  createTaskIntoDB,
  getAllTasksFromDB,
  getTaskById,
  updateTaskStatus,
  updateTask,
  deleteTask,
};
