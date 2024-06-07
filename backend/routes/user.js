import bcrypt from 'bcrypt';
import Router from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import validateReqBody from '../middlewares/validateReqBody.js';
import constants from '../Constants/index.js';
import prisma from '../prisma/index.js';
import crypto from 'crypto';
import checkAuth from '../middlewares/checkAuth.js';
import AppError from '../AppError/index.js';

const router = Router();

const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/register', validateReqBody(registerUserSchema), async (req, res, next) => {
  try {
    const dbUser = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (dbUser) {
      throw new AppError('User already exists', 400);
    }

    req.body.password = await bcrypt.hash(req.body.password, constants.passwordSaltRounds);

    const newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      },
    });

    return res.status(201).send({
      success: true,
      message: `User with id: ${newUser.id} has been successfully created`,
    });
  } catch (error) {
    return next(error);
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/login', validateReqBody(loginSchema), async (req, res, next) => {
  try {
    const dbUser = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!dbUser) {
      throw new AppError('Invalid Credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, dbUser.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid Credentials', 401);
    }

    // include token in a httpOnly cookie
    const jwtToken = jwt.sign({ userId: dbUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    const csrfToken = crypto.randomBytes(32).toString('hex');
    await prisma.session.upsert({
      where: {
        userId: dbUser.id,
      },
      create: {
        userId: dbUser.id,
        csrfToken,
      },
      update: {
        csrfToken,
      },
    });

    res.cookie('CSRF-TOKEN', csrfToken, { sameSite: true, secure: true, maxAge: 3600 * 1000 });
    res.cookie('JWT-TOKEN', jwtToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      maxAge: 3600 * 1000,
    });

    return res.send({
      success: true,
      message: `Login Successful`,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/dashboard', checkAuth, (req, res, next) => {
  return res.send({
    name: req.user.name,
    email: req.user.email,
  });
});

router.post('/logout', checkAuth, async (req, res, next) => {
  try {
    await prisma.session.delete({
      where: {
        userId: req.user.id,
      },
    });

    res.clearCookie('CSRF-TOKEN');
    res.clearCookie('JWT-TOKEN');

    return res.send({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
