const Joi = require("joi");
const { Facility } = require("../models/Facility");
const { User } = require("../models/User");

const addFacility = async (req, res) => {
  const userId = req.user._id;

  const existingUser = await User.findOne({ _id: userId });

  if (existingUser.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to add facility" });
  }

  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().required().valid("Open", "Close"),
    type: Joi.string()
      .required()
      .valid("Restaurant", "Coffee", "Public facilities"),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, description, type, status } = req.body;

  try {
    const allFacility = await Facility.find();

    const existingIds = allFacility.map((facility) => facility.id);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;

    const newFacility = new Facility({
      id: maxId + 1,
      name,
      description,
      type,
      status,
    });

    await newFacility.save();
    res.status(201).json({ message: "Facility added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res
      .status(200)
      .json({ message: "All facilities fetched successfully", facilities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFacility = async (req, res) => {
  const userId = req.user._id;

  const existingUser = await User.findOne({ _id: userId });

  if (existingUser.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete facility" });
  }

  const { id } = req.params;

  try {
    const facility = await Facility.findOneAndDelete({ id });

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.status(200).json({ message: "Facility deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFacility = async (req, res) => {
  const userId = req.user._id;

  const existing = await User.findOne({ _id: userId });

  if (existing.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to update facility" });
  }

  const { id } = req.params;
  const { name, description, type, status } = req.body;

  try {
    const facility = await Facility.findOneAndUpdate(
      { id },
      { name, description },
      { name, description, type },
      {
        name,
        description,
        type,
        status,
      },
      { new: true }
    );

    if (!facility) {
      return res.status(404).json({ message: "facility not found" });
    }

    res.status(200).json({ message: "facility updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFacility,
  getAllFacilities,
  deleteFacility,
  updateFacility,
};
