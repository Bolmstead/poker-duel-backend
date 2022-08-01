/** Routes for users. */
const express = require("express");
const User = require("../models/UserModel");

const router = express.Router();

// route called to grab user's information
router.get("/", async function (req, res, next) {
  try {
    console.log("🐢🐢🐢🐢🐢🐢🐢🐢 SUCCESSFUL API CALL!!!!!!");

    return res.json("successful call!!!");
  } catch (err) {
    return next(err);
  }
});

// route called to grab user's information
router.get("/:username", async function (req, res, next) {
  try {
    let { username } = req.params;
    if (username) {
      console.log(username);

      return res.json(username);
    } else {
      return res.json("no user");
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
