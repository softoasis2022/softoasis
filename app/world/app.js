const express = require("express"); 
const path = require("path"); 
const fs = require("fs");
const routes = express.Router();


const station = require("./routes/station/routes/app");

routes.use("/station", station);


routes.get("/",(req,res)=>{
    const {} = req.body;
    
    res.send("OK");
});

module.exports = routes;
