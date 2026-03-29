const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const mobileroutes = require("./routes/mobile/mobile");
const mainroutes = require("./routes/main/main");

routes.use("/mobile",mobileroutes);
routes.use("/",mainroutes);



module.exports = routes;