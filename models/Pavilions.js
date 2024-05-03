const mongoose = require("mongoose");

const pavilionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    showTime: {
      type: Array,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Pavilion = mongoose.model("pavilion", pavilionSchema);

module.exports = { Pavilion };
