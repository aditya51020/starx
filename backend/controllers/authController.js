import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { JWT_SECRET } from '../config.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });
  const isProduction = true;

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ user: { email: admin.email }, token });
};

export const me = async (req, res) => {
  const admin = await Admin.findById(req.user.id).select('-password');
  res.json({ user: admin });
};