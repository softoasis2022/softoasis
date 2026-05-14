const express = require('express');
const path = require('path');
const fs = require("fs");
const routes = express.Router();

//상점 보기


//가입
routes.get("/register",(req,res)=>{
    const {usernumber,nickname} = req.body;

    

    try{
        fs.readFileSync()
    }
    catch{
        
    }
    finally{
        
    }
});


module.exports = routes;