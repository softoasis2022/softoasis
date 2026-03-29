const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

routes.use("/pages", express.static(path.join(__dirname, "pages")));

routes.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./pages/main/index.html"));
});

module.exports = routes;