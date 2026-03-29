const express = require("express");
const path = require("path");
const fs = require("fs");

const routes = express.Router();
const ROOT = __dirname;

// 정적 파일
routes.use(express.static(ROOT));
//routes.use(express.static(imgDB));

const PAGES_DIR = path.join(ROOT, "pages");


routes.post((req,res)=>{
    
});

module.exports = routes;