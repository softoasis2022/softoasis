const express = require('express');
const path = require('path');
const fs = require("fs");
const routes = express.Router();

//상점 보기

routes.get("/",(req,res)=>{
    const {usernumber} = req.body;

    

    try{
        fs.readFileSync()
    }
    catch{
        
    }
    finally{
        
    }
});



module.exports = routes;