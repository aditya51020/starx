import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const router = express.Router();

const ADMIN_PASSWORD = "starx123";

// ------------------------
//        LOGIN
// ------------------------
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password required" });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({ message: "Login successful", user: { role: "admin" } });
});

// ------------------------
//        CHECK AUTH
// ------------------------
router.get("/check-auth", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return res.json({ isAuthenticated: true, user: { role: "admin" } });
  } catch (err) {
    return res.status(401).json({ isAuthenticated: false });
  }
});

// ------------------------
//        LOGOUT
// ------------------------
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });

  return res.json({ message: "Logged out" });
});

export default router;
