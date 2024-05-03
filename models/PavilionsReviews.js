const mongoose = require("mongoose");

const pavilionReviewSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },

    comments: [
      {
        author: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const PavilionReview = mongoose.model("pavilionReview", pavilionReviewSchema);

module.exports = { PavilionReview };
