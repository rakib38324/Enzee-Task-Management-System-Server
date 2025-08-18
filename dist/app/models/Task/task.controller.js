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
exports.taskControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const commonResponse_1 = __importDefault(require("../../utils/commonResponse"));
const task_service_1 = require("./task.service");
const taskCreat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.TaskServices.createTaskIntoDB(req.body, req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Task created successfully!',
        data: result,
    });
}));
// get all tasks
const getAllTasks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield task_service_1.TaskServices.getAllTasksFromDB((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Tasks retrieved successfully!',
        data: result,
    });
}));
// get all tasks
const getSingleTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const taskId = req.params.id;
    const result = yield task_service_1.TaskServices.getTaskById(taskId, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Task retrieved successfully!',
        data: result,
    });
}));
// update task status
const updateTaskStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    const status = req.body.status;
    const result = yield task_service_1.TaskServices.updateTaskStatus(taskId, status, req.user);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Task status updated successfully!',
        data: result,
    });
}));
// update task
const updateTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    const payload = req.body;
    const result = yield task_service_1.TaskServices.updateTask(taskId, payload, req.user._id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Task updated successfully!',
        data: result,
    });
}));
// delete task
const deleteTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    const result = yield task_service_1.TaskServices.deleteTask(taskId, req.user._id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Task deleted successfully!',
        data: result,
    });
}));
exports.taskControllers = {
    taskCreat,
    getAllTasks,
    getSingleTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
};
