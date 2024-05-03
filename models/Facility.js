const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["Open", "Close"],
    },

    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Restaurant", "Coffee", "Public facilities"],
    },
  },
  { timestamps: true }
);

const Facility = mongoose.model("facility", facilitySchema);

module.exports = { Facility };
