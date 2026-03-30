const express = require('express');
const path = require('path');
const fs = require("fs");
const routes = express.Router();

const social = require("./routes/social/social");
const contant = require("./routes/contant/app");
const mainpageroute = require("./routes/intro/app");


routes.use(express.json());

routes.use("/social",social);


routes.use("/",mainpageroute);
routes.use("/intro",mainpageroute);

routes.use("/contant",contant);

module.exports = routes;