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
exports.TaskServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const task_model_1 = require("./task.model");
const appError_1 = __importDefault(require("../../errors/appError"));
const config_1 = __importDefault(require("../../config/config"));
const sendEmail_1 = require("../../utils/sendEmail");
// ===> Create task into the database
// ===> This function will create a new task in the database
const createTaskIntoDB = (payload, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistTask = yield task_model_1.Task.findOne({ title: payload.title });
    if (isExistTask) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Task with this title already exists');
    }
    const task_info = Object.assign(Object.assign({}, payload), { task_created_by: userData._id, status: 'pending' });
    const task = yield task_model_1.Task.create(task_info);
    return task;
});
// get all task from database using user id
const getAllTasksFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield task_model_1.Task.find({ task_created_by: userId }).populate({
        path: 'task_created_by',
        select: '-password -createdAt -updatedAt -passwordChangedAt',
    });
    return tasks;
});
// get task by id
const getTaskById = (taskId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const taskExists = yield task_model_1.Task.findById(taskId)
        .populate({
        path: 'task_created_by',
        select: '-password -createdAt -updatedAt -passwordChangedAt',
    })
        .select('-createdAt -updatedAt'); // for Task model
    if (!taskExists) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Task not found');
    }
    if (taskExists.task_created_by._id.toString() !== userId) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not authorized to access this task');
    }
    return taskExists;
});
// update task status
// This function will update the status of a task
const updateTaskStatus = (taskId, status, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const taskExists = yield task_model_1.Task.findById(taskId).populate('task_created_by');
    if (!taskExists) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Task not found');
    }
    if (taskExists.task_created_by._id.toString() !== ((_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo._id) === null || _a === void 0 ? void 0 : _a.toString())) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not authorized to update this task. You can only update tasks you created.');
    }
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid status. Allowed values are: pending, in-progress, completed');
    }
    if (taskExists.status === status) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `Task is already in ${status} status`);
    }
    if (status === 'completed' && taskExists.status === 'pending') {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Task cannot be marked as completed directly from pending status');
    }
    const updatedTask = yield task_model_1.Task.findByIdAndUpdate({
        _id: taskId,
    }, { status }, { runValidators: true, new: true });
    if ((updatedTask === null || updatedTask === void 0 ? void 0 : updatedTask.status) === 'completed') {
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
      <h1 style="font-size: 20px; margin-bottom: 15px;">Dear ${userInfo === null || userInfo === void 0 ? void 0 : userInfo.name},</h1>
      <p style="line-height: 1.6; margin-bottom: 20px;">
        Great news! 🎉 Your task <strong>"${updatedTask === null || updatedTask === void 0 ? void 0 : updatedTask.title}"</strong> has been successfully completed.
      </p>
      <p style="text-align: center; margin-bottom: 20px;">
        <a href="${config_1.default.client_url_link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #28a745; border-radius: 5px; text-decoration: none;">
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
        (0, sendEmail_1.sendEmail)(subject, userInfo === null || userInfo === void 0 ? void 0 : userInfo.email, html);
    }
    return updatedTask;
});
// update task
const updateTask = (taskId, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.task_created_by) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You cannot update the Task Woner Informations');
    }
    const taskExists = yield task_model_1.Task.findById({ _id: taskId });
    if (!taskExists) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Task not found');
    }
    if (taskExists.task_created_by._id.toString() !== userId.toString()) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not authorized to update this task. You can only update tasks you created.');
    }
    const updatedTask = yield task_model_1.Task.findByIdAndUpdate({ _id: taskId }, payload, {
        new: true,
        runValidators: true,
    });
    return updatedTask;
});
// delete task
const deleteTask = (taskId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const taskExists = yield task_model_1.Task.findById(taskId);
    if (!taskExists) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Task not found');
    }
    if (taskExists.task_created_by.toString() !== userId.toString()) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not authorized to delete this task, you can only delete tasks you created.');
    }
    const deletedTask = yield task_model_1.Task.findByIdAndDelete(taskId);
    return deletedTask;
});
exports.TaskServices = {
    createTaskIntoDB,
    getAllTasksFromDB,
    getTaskById,
    updateTaskStatus,
    updateTask,
    deleteTask,
};
