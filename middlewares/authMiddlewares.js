import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import Session from '../models/sessionModel.js';
import generateToken from '../utils/generateToken.js';

const protect = asyncHandler(async (req, res, next) => {
  let token, session;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      session = await Session.findOne({ token });
      if (!session || !session.isActive) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }

      jwt.verify(token, process.env.JWT_SECRET);
      req.session = session;

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        token = generateToken(session.user, process.env.JWT_SECRET, '1d');

        session.token = token;
        req.session = await session.save();

        next();
      }

      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
