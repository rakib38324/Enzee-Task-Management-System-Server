import { Router } from 'express';
import { loginRouters } from '../models/Auth/auth.router';
import { userRouter } from '../models/UsersRegistration/userRegistration.router';
import { taskRouter } from '../models/Task/task.router';

const router = Router();

const moduleRouters = [
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/auth',
    route: loginRouters,
  },
  {
    path: '/task',
    route: taskRouter,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
