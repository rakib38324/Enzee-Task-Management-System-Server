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
const updateTaskStatus = (taskId, status, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const taskExists = yield task_model_1.Task.findById(taskId).populate('task_created_by');
    if (!taskExists) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Task not found');
    }
    if (taskExists.task_created_by._id.toString() !== userId.toString()) {
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
