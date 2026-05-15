const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

dotenv.config();

const connectDB = require("./config/db");
const corsOptions = require("./config/corsOptions");
require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const coinsRoutes = require("./routes/coinsRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/coins", coinsRoutes);
app.use("/api/weather", weatherRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Infinite Analytics API is running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`);
});
