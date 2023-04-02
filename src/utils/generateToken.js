import jwt from 'jsonwebtoken';

export default function generateToken(payload, expiresIn) {
  if (!expiresIn) return jwt.sign(payload, process.env.TOKEN_SECRET);
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expiresIn,
  });
}
