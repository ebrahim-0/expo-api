const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();

const login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    rule: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password, rule } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (rule !== user.rule && user.rule !== "admin") {
    return res
      .status(404)
      .json({ message: "You are not allowed to login here" });
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return res.status(404).json({ message: "Invalid Email or Password" });
  }

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

  res.json({
    message: "User Login Successfully",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      rule: user.rule,
    },
    token,
  });
};

module.exports = login;
