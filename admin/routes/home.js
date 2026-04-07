const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

// 페이지 폴더
const PAGES_DIR = path.join(__dirname, "pages");
const TEMPLATE_DIR = path.join(__dirname, "../tamplate", "html");
routes.use("/css", express.static(path.join(__dirname, "pages", "style")));
routes.use("/js", express.static(path.join(__dirname, "pages", "script")));


module.exports = routes;