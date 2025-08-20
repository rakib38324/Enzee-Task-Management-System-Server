import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userRegistration.validation';
import { userControllers } from './userRegistration.controller';
import Auth from '../../middlewares/Auth';
const router = express.Router();

router.post(
  '/user-registration',
  ValidateRequest(UserValidations.createUserValidationSchema),
  userControllers.createUsers,
);

router.get('/get-me', Auth(), userControllers.getMe);
router.get('/', Auth(), userControllers.getAllUsers);
router.get('/:id', Auth(), userControllers.getSingleUser);

router.patch(
  '/update-user/:id',
  Auth(),
  ValidateRequest(UserValidations.updateUserValidationSchema),
  userControllers.updateUsers,
);

export const userRouter = router;
