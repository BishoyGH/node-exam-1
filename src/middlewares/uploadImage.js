import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import AppError from '../utils/AppError.js';

const uploadImage = ({ fieldName, pathName, maxSize = 2097152 }) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${path.resolve()}/uploads/${pathName}`);
    },
    filename: (req, file, cb) => {
      cb(null, `${crypto.randomUUID()}-${file.originalname}`);
    },
  });
  const upload = multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        return cb(null, true);
      }
      cb(new AppError('Wrong File Type'), false);
    },
  });
  return upload.single(fieldName);
};
export default uploadImage;
