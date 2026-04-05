const express = require("express");
const routes = express.Router();

const loginroute = require("./login/app");

routes.use("/login",loginroute);


module.exports = routes;