import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.js';
import errorHandler from './middlewares/errorHandler.js';
import path from 'path';

dotenv.config();

const app = express();

const __dirname = path.resolve();

if (process.env.ENVIRONMENT === 'production')
  app.use(express.static(path.join(__dirname, '..', 'frontend/dist')));

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRoutes);

app.use(errorHandler);

if (process.env.ENVIRONMENT === 'production')
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend/dist', 'index.html'));
  });



app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port: ', process.env.PORT || 3000);
});

