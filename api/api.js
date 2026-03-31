const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const deviceroute = require("./mobile/device");

routes.use("/device",deviceroute);

routes.get((req,res)=>{
    const {} = req.body;
    
});


module.exports = routes;