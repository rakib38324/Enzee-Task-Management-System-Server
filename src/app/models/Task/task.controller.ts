import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { TaskServices } from './task.service';

const taskCreat = catchAsync(async (req, res) => {
  const result = await TaskServices.createTaskIntoDB(req.body, req.user);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task created successfully!',
    data: result,
  });
});

// get all tasks
const getAllTasks = catchAsync(async (req, res) => {
  const result = await TaskServices.getAllTasksFromDB(req.user?._id);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tasks retrieved successfully!',
    data: result,
  });
});

// get all tasks
const getSingleTask = catchAsync(async (req, res) => {
  const taskId = req.params.id;
  const result = await TaskServices.getTaskById(taskId, req.user?._id);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task retrieved successfully!',
    data: result,
  });
});

// update task status
const updateTaskStatus = catchAsync(async (req, res) => {
  const taskId = req.params.id;
  const status = req.body.status;
  const result = await TaskServices.updateTaskStatus(
    taskId,
    status,
    req.user._id,
  );

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task status updated successfully!',
    data: result,
  });
});

// update task
const updateTask = catchAsync(async (req, res) => {
  const taskId = req.params.id;
  const payload = req.body;
  const result = await TaskServices.updateTask(taskId, payload, req.user._id);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task updated successfully!',
    data: result,
  });
});

// delete task
const deleteTask = catchAsync(async (req, res) => {
  const taskId = req.params.id;
  const result = await TaskServices.deleteTask(taskId, req.user._id);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task deleted successfully!',
    data: result,
  });
});

export const taskControllers = {
  taskCreat,
  getAllTasks,
  getSingleTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
};
