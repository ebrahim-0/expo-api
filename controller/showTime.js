const { ShowTime } = require("../models/Showtime");
const { User } = require("../models/User");

const addShowTime = async (req, res) => {
  const userId = req.user._id;

  const existingUser = await User.findOne({ _id: userId });

  if (existingUser.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete pavilion" });
  }

  try {
    const { name, pavilionId, time } = req.body;
    const showTime = new ShowTime({
      pavilionId,
      name,
      time,
    });
    await showTime.save();
    res.status(201).json({ message: "Showtime added successfully", showTime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteShowTime = async (req, res) => {
  const userId = req.user._id;

  const existingUser = await User.findOne({ _id: userId });

  if (existingUser.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete pavilion" });
  }

  try {
    const { id } = req.params;
    await ShowTime.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Showtime deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateShowTime = async (req, res) => {
  const userId = req.user._id;

  const existingUser = await User.findOne({ _id: userId });

  if (existingUser.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete pavilion" });
  }

  try {
    const { id } = req.params;
    const { name, pavilionId, time } = req.body;
    const showTime = await ShowTime.findOneAndUpdate(
      { _id: id },
      { name, pavilionId, time },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Showtime updated successfully", showTime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllShowTimes = async (req, res) => {
  try {
    const showTimes = await ShowTime.find();
    res
      .status(200)
      .json({ message: "All showTimes get successfully", showTimes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addShowTime,
  deleteShowTime,
  updateShowTime,
  getAllShowTimes,
};
