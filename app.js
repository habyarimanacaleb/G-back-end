require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/user");
const serviceRoutes = require("./routes/services");
const applicationRoutes = require("./routes/applicationRoutes");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/", serviceRoutes);
app.use("/", userRoutes);
app.use("/api",applicationRoutes);
const dbUri =
  process.env.DB_URI ||
  `mongodb+srv://Gilbert:${process.env.db_password}@g-portfolio.uknv2.mongodb.net/?retryWrites=true&w=majority&appName=G-PORTFOLIO`;
// console.log(dbUri);
mongoose
  .connect(dbUri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true, // Ensure SSL is enabled
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
