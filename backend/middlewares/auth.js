import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ msg: 'No token found' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
