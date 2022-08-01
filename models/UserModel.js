"use strict";

const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError, UnauthorizedError} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {

}


module.exports = User;
