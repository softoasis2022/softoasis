const express = require("express"); 
const path = require("path"); 
const fs = require("fs");
const routes = express.Router();

const tiket = require("./tiket/app");


//홈
//

routes.use("/ticket", tiket);
routes.get("/",(req,res)=>{
    
});

module.exports = routes;
