const { Ticket } = require("../models/Ticket");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const payment = async (req, res) => {
  const { ticketId } = req.params;
  const { url } = req.query;

  const ticket = await Ticket.findById(ticketId);

  // const quantity = ticket.tickets.reduce((acc, item) => acc + item.quantity, 0);

  try {
    // const lineItems = ticket.map((item) => ({
    //   price_data: {
    //     currency: "sr",

    //     unit_amount: item.totalPrice * 100,
    //   },
    // }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            product_data: {
              name: "Expo Ticket",
              images: ["https://expo-client.vercel.app/assets/logo.png"],
            },
            currency: "sar",
            unit_amount: ticket.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${url}/success?ticketId=${ticketId}`,
      cancel_url: `${url}/cancel`,
      metadata: {
        orderId: ticket._id, // Pass the order ID to metadata for reference
      },
    });

    res.json({ id: session.id, session, status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const payDone = async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId);

  ticket.payed = true;
  await ticket.save();
  res.json({ status: "success" });
};

module.exports = { payment, payDone };
