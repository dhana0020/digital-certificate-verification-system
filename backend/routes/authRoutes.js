const express = require("express");

const {
  registerAdmin,
  loginUser,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

router.get("/admin-test", protect, adminOnly, (req, res) => {
  return res.status(200).json({
    message: "You are authenticated as an admin",
  });
});

module.exports = router;