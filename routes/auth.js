const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Player = require("../models/Player");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// REGISTER USER + CREATE PLAYER PROFILE
router.post("/register", async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const player = new Player({
      name: name || "New Player"
    });

    await player.save();

    const user = new User({
      email,
      password,
      role: role || "player",
      playerId: player._id
    });

    await user.save();

    res.status(201).json({
      message: "User + Player profile created",
      userId: user._id,
      playerId: player._id
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secret123",
      { expiresIn: "7d" }
    );

    res.json({
  token,
  mustChangePassword: user.mustChangePassword,
  displayName: user.displayName || ""
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.password = newPassword;
    user.mustChangePassword = false;

    await user.save();

    res.json({ message: "Password updated successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;