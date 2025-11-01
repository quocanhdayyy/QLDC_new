const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Citizen } = require("../models");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res.status(400).json({ message: "Missing username or password" });

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      // Kiểm tra xem có phải số điện thoại của nhân khẩu không phải chủ hộ không
      const nonHeadCitizen = await Citizen.findOne({
        phone: identifier,
        isHead: { $ne: true },
      });

      if (nonHeadCitizen) {
        return res.status(401).json({
          message: "Tài khoản không tồn tại",
          detail:
            "Chỉ chủ hộ mới có tài khoản đăng nhập. Vui lòng liên hệ chủ hộ hoặc tổ trưởng.",
        });
      }

      return res.status(401).json({
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload = {
      _id: user._id.toString(),
      username: user.username,
      role: user.role,
      fullName: user.fullName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me
router.get("/me", authenticate, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
