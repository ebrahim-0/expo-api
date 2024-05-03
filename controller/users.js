const { User } = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find()
    .select("-password")
    .select("-passwordResetCode")
    .select("-passwordResetExpires")
    .select("-resetCodeVerified");

  if (users.length === 0) {
    return res.status(404).json({ message: "No Users Founded" });
  }

  res.status(200).json({
    message: "All Users Found Successfully",
    users,
  });
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .select("-passwordResetCode")
    .select("-passwordResetExpires")
    .select("-resetCodeVerified");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User Found Successfully",
    user,
  });
};

const deleteUser = async (req, res) => {
  const existingUser = await User.findById(req.params.id);

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  if (existingUser.rule === "admin") {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete admin User" });
  }

  const user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "User Deleted Successfully", user });
};

const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({ message: "User Updated Successfully", user });
};

module.exports = { getAllUsers, getUserById, deleteUser, updateUser };
