import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRoutes);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port: ', process.env.PORT || 3000);
});
