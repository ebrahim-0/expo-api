const Joi = require("joi");
const nodemailer = require("nodemailer");
const HTML_TEMPLATE = require("./mail-template");

const sendMessage = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(10).max(1000).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, message } = req.body;

  console.log("name", name);
  console.log("email", email);
  console.log("message", message);

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    from: `"Expo 👻" <${email}`,
    to: process.env.USER,
    text: message,
    subject: `Message from ${email} by ${name}`,
    replyTo: email, // Set the reply-to address to the email provided in the request body
    sender: email, // Set the sender address to the email provided in the request body
    html: HTML_TEMPLATE(message, name),
  });

  res.status(200).json({ message: "Message sent successfully" });
};

module.exports = sendMessage;
