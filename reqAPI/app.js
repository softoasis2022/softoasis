const express = require("express");
const routes = express.Router();

const smsroute = require("./routes/sms");

routes.use("/sms",smsroute);

module.exports = routes;