const { Ticket } = require("../models/Ticket");
const { User } = require("../models/User");

const bookTickets = async (req, res) => {
  const userId = req.user._id;

  let existingUser = await User.findOne({ _id: userId });

  if (existingUser.rule !== "visitor") {
    return res
      .status(403)
      .json({ message: "You are not allowed to book tickets" });
  }

  const { date, tickets } = req.body;

  function createRandomString(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);
    randomArray.forEach((number) => {
      result += chars[number % chars.length];
    });
    return result.slice(0, 12);
  }

  let existTickets = await Ticket.findOne({ userId });

  let allTickets = await Ticket.find({ date });

  let totalTicketsBooked = allTickets.reduce((acc, ticket) => {
    return acc + ticket.tickets.reduce((acc, t) => acc + t.quantity, 0);
  }, 0);

  console.log("totalTicketsBooked", totalTicketsBooked);

  const totalNewTickets = tickets.reduce(
    (acc, ticket) => acc + ticket.quantity,
    0
  );

  console.log("totalNewTickets", totalNewTickets);

  console.log(
    "totalTicketsBooked + totalNewTickets",
    totalTicketsBooked + totalNewTickets
  );

  if (totalTicketsBooked + totalNewTickets > 10) {
    return res.status(400).json({
      message: `Tickets are sold out for date The available tickets are ${
        10 - totalTicketsBooked
      } tickets`,
    });
  }

  // let allTickets = await Ticket.find();

  // let allDateTickets = allTickets.filter((ticket) => ticket.date === date);

  // console.log("allDateTickets", allDateTickets);
  // for (let ticket of allTickets) {
  //   console.log("length", allTickets.length + 1);

  //   console.log("date", new Date(date).toDateString());

  //   console.log("ticket.date", new Date(ticket.date).toDateString());

  //   console.log("ticket.date === date", ticket.date === date);

  //   if (date === ticket.date && allTickets.length + 1 >= 10) {
  //     return res.status(400).json({ message: "Tickets are sold out" });
  //   }
  // }

  const totalPrice = tickets.reduce(
    (acc, ticket) => acc + ticket.price * ticket.quantity,
    0
  );

  const hashedTickets = createRandomString(JSON.stringify(tickets).length);

  try {
    const ticketsToSave = new Ticket({
      userId,
      date,
      tickets,
      totalPrice,
      hashedTickets,
      ticketId: "ticketId",
    });

    ticketsToSave.ticketId = ticketsToSave._id;
    await ticketsToSave.save();

    res.status(201).json(ticketsToSave);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTicketUser = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteTicket = async (req, res) => {
  const userId = req.user._id;

  let existingUser = await User.findOne({ _id: userId });

  console.log("existingUser", existingUser);

  if (existingUser.rule !== "employee") {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete tickets" });
  }

  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json("Ticket has been deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();

    for (let ticket of tickets) {
      ticket.user = await User.findById(ticket.userId)
        .select("-password")
        .select("-passwordResetCode")
        .select("-passwordResetExpires")
        .select("-resetCodeVerified");
    }
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { bookTickets, getAllTickets, getTicketUser, deleteTicket };
