const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/users");

const app = express();

if (process.env.NODE_ENV === "development") app.use(logger("dev"));

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URL)
  .then((connection) => {
    console.log(`Database connection successful`);
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use(express.static("public/avatars"));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
