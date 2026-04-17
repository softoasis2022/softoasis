const express = require("express");
const routes  = express.Router();
const path = require("path");
const fs = require("fs");
const { json } = require("stream/consumers");
const { route } = require("./app");

const database = path.join("C:", "database");
const developerdatabase = path.join(__dirname,"database");

routes.use("/css", express.static(path.join(__dirname,"pages" ,"css")));
routes.use("/js", express.static(path.join(__dirname,"pages", "js")));



module.exports=routes;