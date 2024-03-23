const Joi = require("joi");
const { PavilionReview } = require("../models/PavilionsReviews");

const addPavilionsReviews = async (req, res) => {
  const { country } = req.params;
  const { author, comment } = req.body;

  const schema = Joi.object({
    author: Joi.string().required(),
    comment: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    let existingPavilionReview = await PavilionReview.findOne({ country });

    if (!existingPavilionReview) {
      const newPavilionReview = new PavilionReview({ country, comments: [] });
      newPavilionReview.comments.push({ author, comment });
      await newPavilionReview.save();

      return res.status(201).json({ message: "Comment added successfully" });
    }

    existingPavilionReview.comments.push({ author, comment });
    await existingPavilionReview.save();

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPavilionReviews = async (req, res) => {
  const { country } = req.params;

  console.log(country);

  try {
    const pavilionReviews = await PavilionReview.findOne({ country });

    if (!pavilionReviews) {
      return res.status(404).json({ message: "Pavilion not found" });
    }

    res.status(200).json({
      message: "Pavilion reviews fetched successfully",
      pavilionReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPavilionsReviews,
  getPavilionReviews,
};
