const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");

// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const database = path.join("C:", "database");
const PAGES_DIR = path.join(ROOT, "pages");

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));
routes.use(cookieParser());

// ✅ 2) 그 다음에 정적 파일 (style.css 등)
routes.use("/css", express.static(PAGES_DIR));
routes.use("/js", express.static(PAGES_DIR));


function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// ✅ 1) "/"는 라우트가 먼저 처리 (login.html을 직접 내려줌)
routes.get("/", (req, res) => {
  //console.log("PAGES_DIR:", PAGES_DIR);
  //console.log("files:", fs.readdirSync(PAGES_DIR));
  return res.sendFile("login.html", { root: PAGES_DIR });
});

routes.post("/",(req, res)=>{
    const {phonenumber} = req.body;
    
    //받은 전화 번호를 기반으로 계정 로그인
    //기존 계정이 있다면 정식 로그인 페이지로 이동
    
    //만약 없다면 정보 확인 해서 로그인 완료
    
    
})
//로그인


module.exports = routes;