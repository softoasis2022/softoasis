
const express = require("express");
const routes = express.Router();
const path = require("path");

const PAGES_DIR = path.join(__dirname);


//인트로 재외 모든 요소 적용
routes.use("/js", express.static(path.join(PAGES_DIR,"js")));
routes.use("/css", express.static(path.join(PAGES_DIR,"css")));


module.exports = routes;