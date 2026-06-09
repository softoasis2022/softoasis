const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const routes = express.Router();

const PAGES_DIR = path.join(__dirname, "./routes", "world", "pages");
const TEMPLATE_PATH = path.join(PAGES_DIR, "html", "tamplate.html");

const database = path.join("C:", "database");
const SESSION_DIR = path.join(database, "session");
const NEO_COOKIE_DIR = path.join(database, "neo", "cookies");

// ==============================
// 🔥 폴더 생성
// ==============================
if (!fs.existsSync(NEO_COOKIE_DIR)) {
    fs.mkdirSync(NEO_COOKIE_DIR, { recursive: true });
}

// ==============================
// 🔥 정적 파일 (인증 제외)
// ==============================
routes.use("/css", express.static(path.join(PAGES_DIR, "css")));
routes.use("/js", express.static(path.join(PAGES_DIR, "js")));



// ==============================
// 🔥 하위 라우트 (인증 이후)
// ==============================
const town = require("./routes/town/app");
const station = require("./routes/station/app");
const pass = require("./routes/pass/app");
const mobile = require("./routes/world/app");
const building = require("./routes/building/app");



//미완성
//  https://neo.softoasis.org라우팅 완료이니
//  sessionid는 softoasis.org 안에있는 sessionid값을 가져올것
//  sessionid 에 있는 값을 가지고 C 드라이브에 있는 database/session/값.json 파일에서 userId를 가진 키의 값을 가지고 와서 다음 함수에 전달
//  sessionid은 요청응답에 넣지 않는다 라우터와 함수만으로 사용한다
// ==============================
// 🔥 인증 middleware
// ==============================
routes.use((req, res, next) => {

    // 쿠키 가져오기
    const cookies = req.headers.cookie || "";

    // sessionid 찾기
    let sessionid = null;

    cookies.split(";").forEach(cookie => {

        const parts = cookie.trim().split("=");

        if (parts[0] === "sessionid") {
            sessionid = parts[1];
        }
    });

    // 세션 없으면 로그인 이동
    if (!sessionid) {
        return redirectLogin(res);
    }

    // 세션 파일 경로
    const sessionPath = path.join(
        SESSION_DIR,
        `${sessionid}.json`
    );

    // 세션 파일 없으면 로그인 이동
    if (!fs.existsSync(sessionPath)) {
        return redirectLogin(res);
    }

    // 세션 읽기
    const sessionData = JSON.parse(
        fs.readFileSync(sessionPath, "utf8")
    );

    // userId 가져오기
    const userId = sessionData.userId;

    // userId 없으면 로그인 이동
    if (!userId) {
        return redirectLogin(res);
    }

    

    // 다음 routes 에 전달
    req.user = {
        userId: sessionData.userId,
        usernumber: sessionData.usernumber
    };

    next();
});

routes.use("/pass", pass);
routes.use("/town", town);
routes.use("/station", station);
routes.use("/m", mobile);
routes.use("/building", building);

// ==============================
// 🔥 페이지 라우트
// ==============================
routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "world.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 오류");

    res.send(result);
});

routes.get("/create", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "worldcreate.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 오류");

    res.send(result);
});


// ==============================
// 🔥 템플릿 함수
// ==============================
function renderTemplate(pagePath) {
    try {
        let template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
        const pageContent = fs.readFileSync(pagePath, "utf-8");

        return template.replace("<!-- MAIN_CONTENT -->", pageContent);
    } catch (err) {
        console.error("템플릿 렌더링 실패:", err);
        return null;
    }
}


// ==============================
// 🔥 로그인 리다이렉트
// ==============================
function redirectLogin(res) {
    return res.redirect("https://www.softoasis.org/acount/login");
}

module.exports = routes;