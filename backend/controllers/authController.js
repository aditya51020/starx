import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js'; // Import User model
import { JWT_SECRET } from '../config.js';

// --- ADMIN AUTH ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Secure Fallback (requires ENV variable)
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (ADMIN_PASSWORD && email === "admin@starx.com" && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ id: "master-admin", role: "admin" }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.json({ user: { email: "admin@starx.com", role: "admin" }, token });
  }

  const admin = await Admin.findOne({ where: { email } });
  if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ user: { email: admin.email, role: 'admin' }, token });
};

export const me = async (req, res) => {
  if (req.user.role === 'admin') {
    const admin = await Admin.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    return res.json({ user: { ...admin.toJSON(), role: 'admin' } });
  } else {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    return res.json({ user: { ...user.toJSON(), role: 'user' } });
  }
};

// --- USER AUTH ---
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign({ id: user.id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: 'user', wishlist: user.wishlist },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: 'user', wishlist: user.wishlist },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};