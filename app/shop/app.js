const express = require("express");
const routes  = express.Router();
const path = require("path");
const fs = require("fs");
const { json } = require("stream/consumers");
const { route } = require("./app");

const database = path.join("Z:", "HDD1", "database");
const developerdatabase = path.join(__dirname,"database");

const coinroutes = require("./routes/coin/app");

routes.use("/coin",coinroutes);

routes.use("/css", express.static(path.join(__dirname, "css")));
routes.use("/js", express.static(path.join(__dirname, "js")));



// routes.use()

//결제창
//

routes.get("/",(req,res)=>{
    //볼 구매 페이지
    
});

routes.post("/bill",(req,res)=>{
    const {} = req.query;
    const coinrowdata = JSON.parse(fs.readFileSync(path.join(developerdatabase,"bill.json"),"utf-8"));
    res.json(coinrowdata);
});


module.exports=routes;