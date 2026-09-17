//경로 admin.softoasis.org로 라우팅 되어 있음

const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();
const cookieParser = require("cookie-parser");
routes.use(cookieParser());


const mobileroutes = require("./routes/mobile"); 
const HRroutes = require("./routes/HR");
const userroutes = require("./routes/user");
const approutes =  require("./routes/home");
const acountroutes =  require("./routes/acount");
const Noticeroutes =  require("./routes/Notice");
const UAMSroutes =  require("./routes/UAMSroutes");
const productroutes =  require("./routes/product");
const orderroutes =  require("./routes/order");

//admin이기때문에 요헝한 아이피가 제한된 아이피에 있지 않으면 안됨
// 요청한 사람의 IP 주소 확인
// 관리자 페이지: 로컬 컴퓨터에서만 접근 허용
routes.use((req, res, next) => {
    const clientIp = req.ip;

    console.log("관리자 페이지 요청 IP:", clientIp);

    req.clientIp = clientIp;

    const allowedIps = [
        "127.0.0.1",
        "::1",
        "::ffff:127.0.0.1",
        "::ffff:106.101.83.58",
        "::ffff:192.168.0.1"
    ];

    if (allowedIps.includes(clientIp)) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "관리자 페이지에 접근할 수 없는 IP입니다."
    });
});
routes.use("/acount", acountroutes);

//쿠키에 admin.softoasis.org 쿠키에 sessionid가 없으면 /acount/login으로 리디렉션
// sessionid 쿠키가 없으면 로그인 페이지로 이동
routes.use((req, res, next) => {
    const { adminSessionId } = req.cookies;

    if (!adminSessionId) {
        return res.redirect("/acount/login");
    }

    req.adminSessionId = adminSessionId;

    next();
});



routes.use("/UAMS", UAMSroutes);
routes.use("/product", productroutes);
routes.use("/order", orderroutes);

//쿠키에 adminid 가 없으면 로그인 페이지(경로 /acount로 리디렉션 : 클라이언트는 admim.softoasis.org/acount/login 으로 리디렉션됨)
//
//
// routes.use((req, res, next) => {

//     // 로그인 관련은 통과
//     if (req.path.startsWith("/acount")) {
//         return next();
//     }

//     const cookies = parseCookies(req.headers.cookie);
//     const adminId = cookies.adminid;

//     if (!adminId) {
//         return res.redirect("/acount/login");
//     }

//     const sessionFile = path.join("C:", "database", "session", `${adminId}.json`);

//     if (!fs.existsSync(sessionFile)) {
//         return res.redirect("/acount/login");
//     }

//     req.admin = JSON.parse(fs.readFileSync(sessionFile, "utf-8"));

//     next();
// });

function parseCookies(cookieStr) {
    const cookies = {};
    if (!cookieStr) return cookies;

    cookieStr.split(";").forEach(cookie => {
        const [key, value] = cookie.trim().split("=");
        cookies[key] = value;
    });

    return cookies;
}


routes.use("/mobile", mobileroutes);
routes.use("/HR", HRroutes);
routes.use("/home", approutes);
routes.use("/", approutes);
routes.use("/user", userroutes);
routes.use("/Notice", Noticeroutes);


module.exports = routes;