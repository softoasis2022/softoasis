const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const database =  path.join("D:");
const recipedata = path.join(database,"recipe");


function devicedata() {

    fs.readFile(path.join(database,"mobile","deviceprofile","samsung.json"), "utf8", (err, data) => {
        if (err) {
            console.error("파일 읽기 실패:", err);
            return;
        }

        const json = JSON.parse(data);
        console.log(json);
    });
}

routes.post("/",(req,res)=>{
    const {recipe} = req.body;
    
    res.json({
        
    })
});


module.exports = routes;