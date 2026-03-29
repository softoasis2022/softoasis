const express = require("express");
const routes = express.Router();
const cookieParser = require("cookie-parser");

// 올바른 이름으로 사용
routes.use(cookieParser());

function cookiecheck(req) {
    return !!req.cookies.sellerid; // sellerid 쿠키가 있으면 true, 없으면 false
}

// 미들웨어
routes.use((req, res, next) => {
    console.log("Seller Middleware Triggered");

    if (cookiecheck(req)) {
        // 쿠키가 있으면 다음으로 진행
        next();
    } else {
        // 쿠키가 없으면 접근 차단
        res.status(401).send("Unauthorized: sellerid cookie missing");
    }
});

module.exports = routes;