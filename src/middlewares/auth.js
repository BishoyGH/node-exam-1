import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import userModel from '../../database/models/user.model.js';

const auth = (req, res, next) => {
  const token = req.header('token');
  if (!token) return next(new AppError('Token is not provided', 400));

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) return next(new AppError('Invalid Token', 401));

    const { _id, isEmailValidated, iat } = decoded;
    if (!isEmailValidated) return next(new AppError('email is not verified', 400));

    const user = await userModel.findById(_id).select({ password: 0 });

    if (!user || !user.isAccountActive) return next(new AppError("User doesn't exist", 404));

    const tokenIat = new Date(iat * 1000);
    if (user.lastLogout - tokenIat > 0) return next(new AppError('You are not logged in', 400));

    req.user = user;
    next();
  });
};

export default auth;
