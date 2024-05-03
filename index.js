const express = require("express");
const connectDB = require("./utils/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");
const cors = require("cors");
const compression = require("compression");
const userRoute = require("./routes/userRoute");

const app = express();
const PORT = 5000 || process.env.PORT;
connectDB();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(compression());

// Enable CORS for all routes
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);

app.use("/api/v1/auth", authRoute);

app.use("/api/v1/user", userRoute);

app.get("/api/v1", (req, res) => {
  res.json({
    message: "expo-api",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  console.log(`Go to http://localhost:${PORT} to see the server`);
});
