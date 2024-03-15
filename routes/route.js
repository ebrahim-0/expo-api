const express = require("express");

const login = require("../controller/login.js");
const createUser = require("../controller/signup.js");
const { authenticate } = require("../middlewares/auth.js");
const {
  resetPassword,
  forgotPassword,
  verifyPasswordResetCode,
  resendCode,
} = require("../controller/passwordReset.js");
const router = express.Router();

// Route to create a new user

router.post("/auth/register", createUser);

// Route to login
router.post("/auth/login", login);

// Route to get user profile
router.get("/auth/me", authenticate, (req, res) => {
  res.json({
    message: `Welcome ${req.user.firstName}`,
    user: {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      rule: req.user.rule,
      phoneNumber: req.user.phoneNumber,
    },
    token: res.cookie.token,
  });
});

// Route to forgot password
router.post("/auth/forgotPassword", forgotPassword);

// Route to resendCode
router.post("/auth/resendCode", resendCode);

// Route to verifyResetCode
router.post("/auth/verifyResetCode", verifyPasswordResetCode);

// Route to resetPassword
router.put("/auth/resetPassword", resetPassword);

// Route to logout
router.get("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/", (req, res) => {
  res.json({
    message: "expo-api",
  });
});

module.exports = router;
