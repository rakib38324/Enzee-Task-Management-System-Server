/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { TTask } from './task.interface';
import { JwtPayload } from 'jsonwebtoken';
import { Task } from './task.model';
import AppError from '../../errors/appError';

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
  userId: JwtPayload,
) => {
  const taskExists = await Task.findById(taskId).populate('task_created_by');
  if (!taskExists) {
    throw new AppError(httpStatus.FORBIDDEN, 'Task not found');
  }

  if (taskExists.task_created_by._id.toString() !== userId.toString()) {
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
