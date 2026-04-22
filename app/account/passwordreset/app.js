const express = require("express");
const routes = express.Router();
const path = require("path");
const fs = require("fs");
// 폴더 기준
const ROOT = __dirname; // mobile 폴더
const PAGES_DIR = path.join(ROOT, "pages");

// 정적 파일
routes.use(express.static(ROOT));

routes.get("/", (req, res) => {
  //console.log("PAGES_DIR:", PAGES_DIR);
  //console.log("files:", fs.readdirSync(PAGES_DIR));
  return res.sendFile("passwordreset.html", { root: PAGES_DIR });
});
routes.post("/", (req, res) => {
  const { userid, password } = req.body;
  if (userid) {
    res.status(400);
  }
  else {
    try {
      const userinfo = JSON.parse(fs.readFileSync(path.join("C:", "database", "app", "user", `${userid}.json`), "utf-8"));
      if (!userinfo) {
        console.log("부정접근");
      }
      else {
        res.status(200).json({
          message: "succese",

        })
      }
    }
    catch {
      const logpath = path.join("C:", "database", "log");
      console.log("에러", req.baseUrl);
      
    }
  }
});


module.exports = routes;