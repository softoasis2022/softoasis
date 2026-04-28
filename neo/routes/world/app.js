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

routes.use("/town", town);
routes.use("/station", station);
routes.use("/pass", pass);


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