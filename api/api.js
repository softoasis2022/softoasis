const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const deviceroute = require("./mobile/device");

routes.use("/device",deviceroute);


module.exports = routes;