"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");


const PORT = process.env.PORT || 3001;


// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Poker Duel Config:".green);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, "tbd");
console.log("---");

module.exports = {
  PORT,
  BCRYPT_WORK_FACTOR,
};
