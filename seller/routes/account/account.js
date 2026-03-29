const express = require("express"); 
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const login = require("./login/app");
const register = require("./register/app");

routes.use("/login",login);
routes.use("/register",register);

module.exports = routes;