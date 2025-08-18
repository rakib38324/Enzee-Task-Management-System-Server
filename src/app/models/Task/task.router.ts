import express from 'express';
import { taskControllers } from './task.controller';
import Auth from '../../middlewares/Auth';
import ValidateRequest from '../../middlewares/validateRequest';
import { TaskValidations } from './task.validation';
const router = express.Router();

router.post(
  '/create-task',
  Auth(),
  ValidateRequest(TaskValidations.createTaskValidationSchema),
  taskControllers.taskCreat,
);

router.get('/', Auth(), taskControllers.getAllTasks);
router.get('/:id', Auth(), taskControllers.getSingleTask);

router.patch(
  '/update-status/:id',
  Auth(),
  ValidateRequest(TaskValidations.updateTaskValidationSchema),
  taskControllers.updateTaskStatus,
);

router.patch(
  '/update-task/:id',
  Auth(),
  ValidateRequest(TaskValidations.updateTaskValidationSchema),
  taskControllers.updateTask,
);

router.delete('/delete-task/:id', Auth(), taskControllers.deleteTask);

export const taskRouter = router;
