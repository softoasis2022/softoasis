const express = require("express");
const fs = require("fs");
const path = require("path");
const routes = express.Router();


routes.use("/js",express.static(path.join(__dirname,"../pages/room")));
routes.use("/css",express.static(path.join(__dirname,"../pages/room")));

//경로 /room 라우팅 예정

// 파트너스,노드,컨텐트 
routes.get("/m", (req, res) => {
  
});
routes.get("/m", (req, res) => {
  
});
routes.get("/partners", (req, res) => {
  
});
routes.get("/node", (req, res) => {
  
});
routes.get("/content", (req, res) => {
  
});

module.exports =routes;