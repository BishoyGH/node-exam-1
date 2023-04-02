import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';
const hashPassword = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(password, Number(process.env.HASH_ROUNDS), (err, hash) => {
    if (err) return next(new AppError(err.message, 500));
    req.hashedPassword = hash;
    next();
  });
};

export default hashPassword;
