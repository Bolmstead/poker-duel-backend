"use strict";

const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const mongoose = require("mongoose");

/** Related functions for users. */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  password: {
    type: String,
    maxlength: 128,
    trim: true,
  }
});

module.exports = mongoose.model("User", userSchema);
