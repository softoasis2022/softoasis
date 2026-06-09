const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const database = path.join("C:", "database");
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const PAGES_DIR = path.join(ROOT, "pages");
const TEMPLATE_PATH = path.join(PAGES_DIR,"html", "tamplate.html");

routes.use("/css", express.static(path.join(__dirname, "pages","css")));
routes.use("/js", express.static(path.join(__dirname, "pages","js")));



//쿼리 빌딩 번호

routes.get("/lobby",(req,res)=>{
    //로비
    const {worldnumber,buidingnumber} = req.query;

    //빌딩 벙보 가지고 오기
    fs.readFileSync(path.join(database,"world","building",`${buidingnumber}.json`))

    
});
routes.get("/Construction",(req,res)=>{
    //월드 번호
    const {worldnumber,buidingnumber} = req.query;


    //월드의 타일정보르 가지고 오는 디비 루트
    const worldinfo = JSON.parse(fs.readFileSync(path.join(database,"world",worldnumber,"info.json"),"utf-8"));

    console.log(worldinfo.building.length);

    res.status(200).send("응답 완료");
    
});

module.exports = routes;