import AppError from '../utils/AppError.js';

const validation = (schema) => {
  for (const prop in schema) {
    return (req, res, next) => {
      const result = schema[`${prop}`].validate(req[`${prop}`], { abortEarly: false });
      if (result?.error) return next(new AppError(result.error, 400));
      next();
    };
  }
};

export default validation;
