const { Pavilion } = require("../models/Pavilions");

const { ShowTime } = require("../models/Showtime");
const { User } = require("../models/User");

const addShowTime = async (req, res) => {
  const userId = req.user._id;

  const existingUser = await User.findOne({ _id: userId });

  if (existingUser.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to add showtime" });
  }

  try {
    const { name, pavilionId, time } = req.body;

    const existingPavilion = await Pavilion.findOne({ id: pavilionId });

    if (!existingPavilion) {
      return res.status(400).json({ message: "Pavilion not found" });
    }

    const showTime = new ShowTime({
      pavilionId,
      name,
      time,
    });

    existingPavilion.showTime.push(showTime);

    await existingPavilion.save();
    await showTime.save();
    res.status(201).json({ message: "Showtime added successfully", showTime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteShowTime = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const existingUser = await User.findOne({ _id: userId });

  if (existingUser.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete showtime" });
  }

  try {
    const existingShowTime = await ShowTime.findById(id);

    const existingPavilion = await Pavilion.findOne({
      id: existingShowTime.pavilionId,
    });

    existingPavilion.showTime = existingPavilion.showTime.filter(
      (showTime) => showTime._id.toString() !== id
    );

    await existingPavilion.save();

    await ShowTime.findByIdAndDelete({ _id: id });

    res.status(200).json({ message: "Showtime deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateShowTime = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { name, pavilionId, time } = req.body;

  const existingUser = await User.findOne({ _id: userId });

  if (existingUser.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to update showtime" });
  }

  try {
    const showTime = await ShowTime.findOneAndUpdate(
      { _id: id },
      { name, pavilionId, time },
      { new: true }
    );

    const existingPavilion = await Pavilion.findOne({
      id: pavilionId,
    });

    existingPavilion.showTime = existingPavilion.showTime.map((show) =>
      show._id.toString() === id ? showTime : show
    );

    await existingPavilion.save();

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

    const pavilions = await Pavilion.find();

    let test = showTimes.forEach((showTime) => {
      return pavilions.find((pavilion) => pavilion.id === showTime.pavilionId);
    });

    res
      .status(200)
      .json({ message: "All showTimes get successfully", showTimes, test });
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
