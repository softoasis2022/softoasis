const express = require('express');
const path = require('path');
const fs = require("fs");
const routes = express.Router();

const social = require("./routes/social/social");
const contant = require("./routes/contant/app");
const intropageroute = require("./routes/intro/app");
const mainpageroute = require("./routes/main/app");

routes.use(express.json());

routes.use("/social",social);
routes.use("/",mainpageroute);
routes.use("/intro",intropageroute);
routes.use("/contant",contant);
routes.post("/join",(req,res)=>{
    const {roomnumber} = req.body;

    
})

module.exports = routes;