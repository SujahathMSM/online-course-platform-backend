const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../src/routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  console.log("Called");
  res.send("API is running well");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started on PORT: ${PORT}`);
});
