const Joi = require("joi");
const { Pavilion } = require("../models/Pavilions");

const addPavilion = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, description } = req.body;

  try {
    const allPavilions = await Pavilion.find();

    const existingIds = allPavilions.map((pavilion) => pavilion.id);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;

    const pavilion = new Pavilion({
      id: maxId + 1,
      name,
      description,
    });

    await pavilion.save();
    res.status(201).json({ message: "Pavilion added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPavilions = async (req, res) => {
  try {
    const pavilions = await Pavilion.find();
    res
      .status(200)
      .json({ message: "All pavilions fetched successfully", pavilions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePavilion = async (req, res) => {
  const { id } = req.params;

  try {
    const pavilion = await Pavilion.findOneAndDelete({ id });

    if (!pavilion) {
      return res.status(404).json({ message: "Pavilion not found" });
    }

    res.status(200).json({ message: "Pavilion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePavilion = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const pavilion = await Pavilion.findOneAndUpdate(
      { id },
      { name, description },
      { new: true }
    );

    if (!pavilion) {
      return res.status(404).json({ message: "Pavilion not found" });
    }

    res.status(200).json({ message: "Pavilion updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPavilions,
  addPavilion,
  deletePavilion,
  updatePavilion,
};
