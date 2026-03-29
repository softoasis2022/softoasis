const express = require("express");
const routes = express.Router();

const loginroute = require("./login/app");
const findroute = require("./find/app");
const passwordresetroute = require("./passwordreset/app");
const registerroute = require("./register/app");

routes.use("/login",loginroute);
routes.use("/find",findroute);
routes.use("/passwordreset",passwordresetroute);
routes.use("/signup",registerroute);

module.exports = routes;