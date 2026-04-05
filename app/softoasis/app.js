const express = require("express"); 
const path = require("path"); 
const fs = require("fs");
const routes = express.Router();

const database = path.join("D:", "database");
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const PAGES_DIR = path.join(ROOT, "pages");
const imgDB = path.join(database, "image");
const TEMPLATE_PATH = path.join(PAGES_DIR, "tamplate", "index.html");

routes.use("/pages", express.static(path.join(__dirname, "pages")));


module.exports = routes;
