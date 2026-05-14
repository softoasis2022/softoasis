const express = require("express");
const routes = express.Router();
const path = require("path");
const fs = require("fs");

const instaMainRouter = require("./social");

// JSON 바디 받기
routes.use(express.json());

// 라우트 연결
routes.use("/social", instaMainRouter);

module.exports = routes;