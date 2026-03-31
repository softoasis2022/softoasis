const express = require("express");
const routes = express.Router();
const path = require("path");

// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로

const PAGES_DIR = path.join(ROOT, "pages");
routes.use(express.static(ROOT));

routes.get("/", (req, res) => {

  res.sendFile("html/index.html", {
    root: PAGES_DIR
  });
});
routes.use("/js", express.static(path.join(PAGES_DIR,"js")));
routes.use("/css", express.static(path.join(PAGES_DIR,"css")));

module.exports = routes;