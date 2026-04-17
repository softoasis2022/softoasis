const express = require("express");
const routes  = express.Router();
const path = require("path");
const fs = require("fs");
const { json } = require("stream/consumers");

const database = path.join("Z:", "HDD1", "database");
const developerdatabase = path.join(__dirname,"database");
const PAGES_DIR = path.join(__dirname,"./routes","main","pages");
const TEMPLATE_PATH =path.join(__dirname,"./routes","tamplate", "pages", "html", "index.html");

routes.use("/css", express.static(path.join(__dirname, "css")));
routes.use("/js", express.static(path.join(__dirname, "js")));

routes.post("/catogory",(req,res)=>{
    const { catogorynumnber } = req.body;

    JSON.parse(fs.readFileSync(path.join("C:","database","shop",""),"utf-8"));
    
    res.status(200).json();
});


module.exports=routes;