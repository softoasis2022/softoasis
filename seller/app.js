const express = require("express");
const path = require("path");
const routes = express.Router();
const fs = require("fs");

//routes.use(express.static(path.join(__dirname, "mobile", "pages", "login")));
const account = require("./routes/account/account");
const mobile = require("./routes/mobile/mobile");
const intro = require("./routes/intro/app");
const main = require("./routes/main/app");

routes.use("/main",main);
routes.use("/mobile",mobile);
routes.use("/account",account);
routes.use("/intro",intro);

module.exports = routes;