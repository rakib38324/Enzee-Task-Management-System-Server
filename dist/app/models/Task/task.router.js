"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("./task.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const task_validation_1 = require("./task.validation");
const router = express_1.default.Router();
router.post('/create-task', (0, Auth_1.default)(), (0, validateRequest_1.default)(task_validation_1.TaskValidations.createTaskValidationSchema), task_controller_1.taskControllers.taskCreat);
router.get('/', (0, Auth_1.default)(), task_controller_1.taskControllers.getAllTasks);
router.get('/:id', (0, Auth_1.default)(), task_controller_1.taskControllers.getSingleTask);
router.patch('/update-status/:id', (0, Auth_1.default)(), (0, validateRequest_1.default)(task_validation_1.TaskValidations.updateTaskValidationSchema), task_controller_1.taskControllers.updateTaskStatus);
router.patch('/update-task/:id', (0, Auth_1.default)(), (0, validateRequest_1.default)(task_validation_1.TaskValidations.updateTaskValidationSchema), task_controller_1.taskControllers.updateTask);
router.delete('/delete-task/:id', (0, Auth_1.default)(), task_controller_1.taskControllers.deleteTask);
exports.taskRouter = router;
