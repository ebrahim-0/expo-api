const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const Joi = require("joi");

const createUser = async (req, res) => {
  const { rule } = req.body;

  const mainSchema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  };

  if (rule) {
    const schema = Joi.object({
      ...mainSchema,
      rule: Joi.string().required().valid("visitor", "employee"),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  } else {
    const schema = Joi.object(mainSchema);

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  }

  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ message: "User Already Exist. Please Login" });
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      rule,
    });

    await user.save();

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
      message: "User Created Successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        rule: user.rule,
      },
      token,
    });
  } catch (error) {
    console.log("Got an error", error);
  }
};

module.exports = createUser;
