const express = require("express");
const path = require("path");
const routes = express.Router();

// 🔹 D드라이브 (사용자/방문자 이미지)
const database = path.join("D:", "database");
const USER_IMAGE_ROOT = path.join(database, "image");

routes.use(express.static(USER_IMAGE_ROOT));
routes.use("/UI", express.static(path.join(__dirname, "UI")));
routes.use("/UI", express.static(path.join(__dirname, "view")));
routes.use("/UI", express.static(path.join(__dirname, "profile")));

module.exports = routes;
