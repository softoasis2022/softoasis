const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const deviceroute = require("./mobile/device");
const developercenter = require("./routes/developercenter");
const smsroute = require("./routes/sms/sms");

routes.use("/",developercenter);
routes.use("/device",deviceroute);



module.exports = routes;