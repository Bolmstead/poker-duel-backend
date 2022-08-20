/** Routes for users. */
const express = require("express");
const User = require("../models/user.model");
const Game = require("../models/game.model");


const router = express.Router();

// route called to grab user's information
router.post("/login", async function (req, res, next) {
  try {
    console.log("🐢🐢🐢🐢🐢🐢🐢🐢 SUCCESSFUL API CALL!!!!!!");

    return res.json("successful call!!!");
  } catch (err) {
    return next(err);
  }
});

// route called to grab user's information
router.get("/register", async function (req, res, next) {
  try {
    console.log("req.body", req.body);

    return res.json(username);
  } catch (err) {
    return next(err);
  }
});

router.get("/test", async function (req, res, next) {
  try {
    console.log("made it to test route! 🪅🎊🎉🧸💥" );

    return res.json("success test call!");
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
