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
const guest = require("../controller/guest.js");
const router = express.Router();

// Route to create a new user

router.post("/register", createUser);

// Route to login
router.post("/login", login);

// Route to create a guest user
router.get("/guest", guest);

// Route to get user profile
router.get("/me", authenticate, (req, res) => {
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
router.post("/forgotPassword", forgotPassword);

// Route to resendCode
router.post("/resendCode", resendCode);

// Route to verifyResetCode
router.post("/verifyResetCode", verifyPasswordResetCode);

// Route to resetPassword
router.put("/resetPassword", resetPassword);

// Route to logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
