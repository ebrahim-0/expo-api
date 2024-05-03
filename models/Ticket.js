const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    payed: {
      type: Boolean,
      required: true,
      default: false,
    },

    hashedTickets: {
      type: String,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    date: {
      type: Date,
      required: true,
    },

    tickets: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = { Ticket };
