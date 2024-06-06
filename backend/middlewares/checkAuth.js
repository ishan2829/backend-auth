import jwt from 'jsonwebtoken';
import AppError from '../AppError/index.js';
import prisma from '../prisma/index.js';

const checkAuth = async (req, res, next) => {
  try {
    const jwtToken = req.cookies['JWT-TOKEN'];
    const csrfTokenFromHeader = req.headers['csrf-token'];
    const csrfTokenFromCookie = req.cookies['CSRF-TOKEN'];

    if (!jwtToken || !csrfTokenFromCookie || !csrfTokenFromHeader) {
      throw new AppError('Unauthorised', 401);
    }

    if (csrfTokenFromCookie !== csrfTokenFromHeader) {
      throw new AppError('Unauthorised', 401);
    }

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    if (!decoded.userId) {
      throw new AppError('Unauthorised', 401);
    }

    const session = await prisma.session.findFirst({
      where: {
        userId: decoded.userId,
      },
      include: {
        user: true,
      },
    });

    if (!session || session.csrfToken !== csrfTokenFromCookie) {
      throw new AppError('Unauthorised', 401);
    }

    req.user = session.user;
    return next();
  } catch (error) {
    next(error);
  }
};

export default checkAuth;
