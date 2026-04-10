const express = require('express');
const path = require('path');
const fs = require("fs");
const routes = express.Router();

const databasepath = path.join("d")

//게임캐릭터 만들기
// 인벤토리,내정보,탐험,아이템얻기,상점,대장간(smithy)
//레벨





//인벤토리
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