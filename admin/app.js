const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();



const mobileroutes = require("./routes/mobile"); 
const HRroutes = require("./routes/HR");
const userroutes = require("./routes/user");
const approutes =  require("./routes/home");
routes.use("/mobile", mobileroutes);
routes.use("/HR", HRroutes);
routes.use("/home", approutes);
routes.use("/", approutes);
routes.use("/user", userroutes);

module.exports = routes;