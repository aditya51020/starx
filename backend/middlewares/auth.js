import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: 'No token found' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};
