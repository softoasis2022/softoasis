//station

const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const database = path.join("D:", "database");
// 네 환경 그대로
const imgDB = path.join(database, "image");

routes.use("/pages", express.static(path.join(__dirname, "pages")));

routes.use("/css", express.static(path.join(__dirname, "pages","css")));
routes.use("/js", express.static(path.join(__dirname, "pages","js")));

routes.get("/", (req, res) => {
    const pagesRoot = path.join(__dirname, "pages");

    return res.sendFile("ticketsellect/html/index.html", { root: pagesRoot });
});





module.exports = routes;
