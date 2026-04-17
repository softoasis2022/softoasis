const express = require("express");
const routes  = express.Router();
const path = require("path");
const fs = require("fs");

const database = path.join("C:", "database");
const coinroutes = require("./routes/coin/app");

routes.use("/css", express.static(path.join(__dirname, "css")));
routes.use("/js", express.static(path.join(__dirname, "js")));


routes.get("/",(req,res)=>{
    const {} = req.query;
    
});

module.exports=routes;