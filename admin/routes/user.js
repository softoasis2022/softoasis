const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();


routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html","home","index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

module.exports = routes;