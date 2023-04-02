process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥');
  console.log(err.name, err.message);
});

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import dbConnection from './database/dbConnection.js';
import globalError from './src/utils/globalError.js';
import AppError from './src/utils/AppError.js';
import userRouter from './src/modules/user/user.router.js';
import postRouter from './src/modules/post/post.router.js';
import commentRouter from './src/modules/comment/comment.router.js';
import likeRouter from './src/modules/like/like.router.js';

/******************************************************************************
 * Global Configuration
 ******************************************************************************/
dotenv.config();
const app = express();
const port = process.env.PORT ?? 3000;
const API_URL = process.env.baseAPIURL ?? '';
const appName = process.env.APP_NAME ?? 'app';
/******************************************************************************
 * Global middlwares
 ******************************************************************************/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));
/******************************************************************************
 * Database Connection
 ******************************************************************************/
dbConnection();
/******************************************************************************
 * Routing
 ******************************************************************************/
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Node Exam App Home Page' });
});
app.use(`${API_URL}/user`, userRouter);
app.use(`${API_URL}/post`, postRouter);
app.use(`${API_URL}/comment`, commentRouter);
app.use(`${API_URL}/like`, likeRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} cannot be found`, 404));
});
/******************************************************************************
 * Global Error Handler
 ******************************************************************************/
app.use(globalError);

app.listen(port, () => {
  console.log(`${appName} is listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥');
  console.log(err.name, err.message);
});
