const mongoose = require("mongoose");

const showTimeSchema = new mongoose.Schema(
  {
    pavilionId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ShowTime = mongoose.model("showTime", showTimeSchema);

module.exports = { ShowTime };
