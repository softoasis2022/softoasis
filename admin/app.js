//경로 admin.softoasis.org로 라우팅 되어 있음

const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const mobileroutes = require("./routes/mobile"); 
const HRroutes = require("./routes/HR");
const userroutes = require("./routes/user");
const approutes =  require("./routes/home");
const acountroutes =  require("./routes/acount");

routes.use("/acount", acountroutes);

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


module.exports = routes;