const express = require("express");
const path = require("path");
const routes = express.Router();
const database = path.join("D:", "database")
const fs = require("fs");

routes.use(express.static(path.join(__dirname, "pages", "main")));
routes.use(express.static(path.join(__dirname, "pages", "meal")));
routes.use(express.static(path.join(__dirname, "pages", "ingredients")));

function cookiecheck(req, res, next) {
    // 로그인 페이지 요청은 제외
    if (req.path !== "/mypage") {
        return next();
    }

    if (req.cookies.sellerid) {
        console.log("쿠키 확인 완료");
        return next();
    } else {
        console.log("쿠키 없음 → 로그인 페이지로 리다이렉트");
        return res.redirect("/seller/login");
    }
}


routes.use(cookiecheck);

routes.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "pages", "main") });
});
routes.get("/ingredients", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "pages", "meal") });
});
routes.get("/meal", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "pages", "meal") });
});


module.exports = routes;