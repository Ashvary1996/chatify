const express = require("express");
const signUpFn = require("../controller/signup");
const route = express.Router();

route.post("/registration", signUpFn);



module.exports = route;
