const express = require("express");
const routes  = express.Router();
const path = require("path");
const fs = require("fs");

const database = path.join("C:", "database");
const developerdatabase = path.join(__dirname,"database");

// 정적 파일
routes.use("/css", express.static(path.join(__dirname,"pages" ,"css")));
routes.use("/js", express.static(path.join(__dirname,"pages", "js")));

module.exports = routes;