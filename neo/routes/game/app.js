const express = require('express');
const path = require('path');
const fs = require("fs");
const routes = express.Router();


const dice = require("./routes/game/ramdomdice/app");
routes.use("/dice",dice);


module.exports = routes;