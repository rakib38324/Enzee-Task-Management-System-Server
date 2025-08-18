import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import router from './app/routers';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';

const app: Application = express();

//--->parser
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//==========>application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Enzee Task Management Server is running successfully.');
});

//========> handle the router not found
app.use(notFound);

//--> global error
app.use(globalErrorHandler);
export default app;
