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

module.exports = routes;