const express = require("express"); 
const path = require("path"); 
const fs = require("fs");
const routes = express.Router();

const tiket = require("./tiket/app");

routes.use("/custom", tiket);
routes.use("/basic", tiket);

module.exports = routes;