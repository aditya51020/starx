import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { login, signup, userLogin, me, updateWishlist } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "starx123";

// ------------------------
//        LOGIN
// ------------------------

// Admin Login (Legacy/Simple)
router.post("/login", login);

// User Login
router.post("/login/user", userLogin);

// User Signup
router.post("/signup", signup);


// ------------------------
//        CHECK AUTH
// ------------------------
router.get("/check-auth", (req, res) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // You could also fetch full user here if needed, or rely on 'me' endpoint
    return res.json({
      isAuthenticated: true,
      user: { id: decoded.id, role: decoded.role || 'user' },
      token: token
    });
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

// ------------------------
//        WISHLIST
// ------------------------
router.post("/wishlist", protect, updateWishlist);

export default router;
