const { User } = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const forgotPassword = async (req, res) => {
  // 1) Validate user email
  const schema = Joi.object({ email: Joi.string().required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: "Failed",
      message: "There is no user with this email address",
    });
  }
  // 2) Generate the random reset token or random 5 digits and save it in db (explain it on draw.io)
  // 2) Generate random reset code and save it in db
  // save the encrypted reset code into our db and send the un encrypted via email
  // https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/
  // generate 5 digit random number in javascript

  const resetCode = Math.floor(Math.random() * 90000 + 10000).toString();

  // encrypt the reset code before saving it in db (Security)
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // console.log(resetCode);
  // console.log(hashedResetCode);

  // Save password reset code into database
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min for example)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // because user maybe send new code after verify one
  user.resetCodeVerified = false;
  user.save();

  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    await sendEmail(
      user.email,
      "Your Password Reset Code (valid for 10 min)",
      "",
      resetCode,
      user.firstName
    );

    res.status(200).json({
      status: "Success",
      message: "Reset code sent to your email",
      userId: user.id,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;

    res.send("An error occurred");
    console.log(error);
  }
};

const resendCode = async (req, res) => {
  // 1) Validate user email
  const schema = Joi.object({ userId: Joi.string().required() });
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  const { userId } = req.body;

  console.log(userId);

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({
      status: "Failed",
      message: "There is no user with this email address",
    });
  }
  // 2) Generate the random reset token or random 5 digits and save it in db (explain it on draw.io)
  // 2) Generate random reset code and save it in db
  // save the encrypted reset code into our db and send the un encrypted via email
  // https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/
  // generate 5 digit random number in javascript

  const resetCode = Math.floor(Math.random() * 90000 + 10000).toString();

  // encrypt the reset code before saving it in db (Security)
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // console.log(resetCode);
  // console.log(hashedResetCode);

  // Save password reset code into database
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min for example)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // because user maybe send new code after verify one
  user.resetCodeVerified = false;
  user.save();

  try {
    const schema = Joi.object({ userId: Joi.string().required() });
    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    await sendEmail(
      user.email,
      "Your Password Reset Code (valid for 10 min)",
      "",
      resetCode,
      user.firstName
    );

    res.status(200).json({
      status: "Success",
      message: "Reset code resent to your email",
      userId: user.id,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;

    res.send("An error occurred");
    console.log(error);
  }
};

const verifyPasswordResetCode = async (req, res, next) => {
  const schema = Joi.object({ resetCode: Joi.string().required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // 1) Get user based on reset code ! because we have not user id
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  // 2) Check if reset code is valid or expired
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({
      status: "Failed",
      message: "Reset code is invalid or has expired",
    });
  }
  // 4) If reset code has not expired, and there is user send res with userId
  user.resetCodeVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
    message: "Reset code verified successfully",
    userId: user._id,
  });
};

const resetPassword = async (req, res, next) => {
  const { userId } = req.query;

  if (!userId)
    return res
      .status(400)
      .json({ status: "Failed", message: "User id is required" });

  const schema = Joi.object({ newPassword: Joi.string().required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // 1) Get user based on email
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({
      status: "Failed",
      message: "There is no user with this id",
    });
  }
  // Check if user verify the reset code
  if (!user.resetCodeVerified) {
    return res.status(400).json({
      status: "Failed",
      message: "reset code not verified",
    });
  }

  const salt = 10;
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

  const isOldPassword = await bcrypt.compare(
    req.body.newPassword,
    user.password
  );

  if (isOldPassword) {
    return res.status(400).json({
      status: "Failed",
      message: "New password can't be the same as the old password",
    });
  }

  // 2) Update user password & Hide passwordResetCode & passwordResetExpires from the result
  user.password = hashedPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.resetCodeVerified = undefined;

  await user.save();

  // 3) If everything ok, send token to client
  const token = jwt.sign(
    {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      rule: user.rule,
    },
    process.env.SECRET_KEY,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );

  res.status(200).json({
    status: "Success",
    message: "Password reset successfully",
    token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      rule: user.rule,
    },
  });
};

module.exports = {
  forgotPassword,
  resendCode,
  verifyPasswordResetCode,
  resetPassword,
};
