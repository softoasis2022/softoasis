const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const deviceroute = require("./mobile/device");
const developercenter = require("./routes/developercenter");

routes.use("/device",deviceroute);
routes.use("/",developercenter);


module.exports = routes;