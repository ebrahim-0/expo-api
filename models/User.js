const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    confirm_password: {
      type: String,
    },

    passwordResetCode: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    resetCodeVerified: {
      type: Boolean,
    },

    rule: {
      type: String,
      enum: ["guest", "admin", "visitor", "employee"],
      default: "visitor",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
