const express = require("express");
const routes = express.Router();
const fs = require("fs");
const path = require("path");
const database = path.join("D:", "database");

//51465741478147
function worldinfo(userId){
    const worldnumber = JSON.parse(fs.readFileSync(path.join(database,"app","user","info",`${userId}.json`))).world.worldnumber;
    const worldinfo = JSON.parse(fs.readFileSync(path.join(database,"world","worldlist",`${worldnumber}.json`)));
    return worldinfo
}


routes.post("/",(req,res)=>{
    const worlddata = worldinfo(req.userId);
    console.log(worlddata);
})

module.exports = routes