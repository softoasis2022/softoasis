const express = require("express");
const path = require("path");
const fs = require("fs");

const tamplatepath = path.join(__dirname,"../intro","pages","html","index.html");

const routes = express.Router();
routes.use("/css", express.static(path.join(__dirname, "pages/css")));
routes.use("/js", express.static(path.join(__dirname, "pages/js")));
routes.use("/image", express.static(path.join(__dirname, "pages/image")));

routes.get("/", (req, res) => {
  console.log(path.join(__dirname, "image"));

  res.sendFile("index.html", {
    root: path.join(__dirname, "pages", "html")
  });
});
module.exports = routes;