const express = require("express");
const path = require("path");
const routes = express.Router();
const fs = require("fs");

// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const database = path.join("D:", "database");
const PAGES_DIR = path.join(ROOT,"page");
const imgDB= path.join(database, "image");

// 정적 파일
routes.use(express.static(ROOT));
routes.use(express.static(imgDB));

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

//쿠키 확인
//로그인 안되어 있으면 로그인 페이지로 이동

// ✅ 1) "/"는 라우트가 먼저 처리 (login.html을 직접 내려줌)
routes.get("/", (req, res) => {
  //console.log("PAGES_DIR:", PAGES_DIR);
  //console.log("files:", fs.readdirSync(PAGES_DIR));
  return res.sendFile("index.html", { root: PAGES_DIR });
});

// ✅ 2) 그 다음에 정적 파일 (style.css 등)
routes.use("/page", express.static(PAGES_DIR));

module.exports = routes;