const express = require("express");
const { signUp, login } = require("../controller/authController");

const routers = express.Router();

routers.post("/signup", signUp);
routers.post("/login", login);
module.exports = routers;
