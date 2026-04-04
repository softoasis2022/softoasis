const express = require('express');
const path = require('path');
const fs = require("fs");
const routes = express.Router();


const dice = require("./routes/game/ramdomdice/app");
const rock = require("./routes/game/rock/app");
routes.use("/dice",dice);
routes.use("/rock",rock);


module.exports = routes;