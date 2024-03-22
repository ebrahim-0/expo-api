const { User } = require("../models/User");
const jwt = require("jsonwebtoken");

const guest = async (req, res) => {
  const oldUser = await User.findOne({ email: "guest@guest" });

  if (!oldUser) {
    newUser = new User({
      firstName: "Guest",
      lastName: "User",
      phoneNumber: "0000000000",
      email: "guest@guest",
      password: "guest",
      rule: "guest",
    });

    await newUser.save();

    user(res, newUser);
  } else {
    user(res, oldUser);
  }
};

const user = (res, user) => {
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
    message: "Guest User Created Successfully",
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

module.exports = guest;
