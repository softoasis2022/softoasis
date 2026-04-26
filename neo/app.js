const express = require('express');
const path = require('path');
const fs = require("fs");
const routes = express.Router();

//neo.softoasis.org 라우팅 완료

const social = require("./routes/social/social");
const contant = require("./routes/contant/app");
const intropageroute = require("./routes/intro/app");
const mainpageroute = require("./routes/main/app");
const tamplatepageroute = require("./routes/tamplate/app");

routes.use(express.json());

routes.use("/tamplate",tamplatepageroute);
routes.use("/social",social);
routes.use("/",mainpageroute);
routes.use("/main",mainpageroute);
routes.use("/intro",intropageroute);
routes.use("/contant",contant);
routes.use("/recipe", require("./routes/recipe/app"));
//neo에서 사용하는 메인 컨텐츠 neo.softoasis.org, 제공 제한 : 없음 (로그인이 필요한 것들은 제한, 개별 로그인 사용)
routes.use("/world", require("./routes/world/app"));
routes.use("/tester", require("./routes/tester/app"));

routes.post("/join",(req,res)=>{
    const {roomnumber} = req.body;

    
})

module.exports = routes;