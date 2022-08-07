"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const usersRoutes = require("./routes/usersRoutes");
const PORT = require("./config");

const morgan = require("morgan");
const app = express();



app.use(cors({
  origin: "https://olmstead-ball.netlify.app"
}));
app.use(express.json());
app.use(morgan("tiny"));

// app.use("/users", usersRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
