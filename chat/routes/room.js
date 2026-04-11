const express = require("express");
const fs = require("fs");
const path = require("path");
const routes = express.Router();


routes.use("/js",express.static(path.join(__dirname,"../pages/room")));
routes.use("/css",express.static(path.join(__dirname,"../pages/room")));

//경로 /room 라우팅 예정


routes.use((req,res,next)=>{
    //
    next();
});

// 파트너스,노드,컨텐트 
routes.get("/", (req, res) => {
    const {roomnumber, usernumber} = req.query;
});
routes.get("/partners", (req, res) => {
    const {roomnumber, usernumber} = req.query;
    
});
routes.get("/node", (req, res) => {
    const {roomnumber, usernumber} = req.query;
});
routes.get("/content", (req, res) => {
    const {roomnumber, usernumber} = req.query;
});

module.exports =routes;