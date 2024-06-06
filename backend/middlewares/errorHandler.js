import joi from 'joi';
import AppError from '../AppError/index.js';
import jwt from 'jsonwebtoken';

const errorConfigs = [
  {
    class: AppError,
    getMessage: (error) => error.message,
    statusCode: (error) => error.statusCode,
  },
  {
    class: joi.ValidationError,
    getMessage: (error) => error.message,
    statusCode: () => 400,
  },
  {
    class: jwt.TokenExpiredError,
    getMessage: (error) => error.message,
    statusCode: () => 401,
  },
];

const errorHandler = (error, req, res, next) => {
  console.log(error);
  for (const errorConfig of errorConfigs) {
    if (error instanceof errorConfig.class) {
      return res.status(errorConfig.statusCode(error) ?? 500).send({
        success: false,
        message: errorConfig.getMessage(error),
      });
    }
  }

  return res.status(500).send({ success: false, error: 'Unknown Error' });
};

export default errorHandler;
