const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const PAGES_DIR = path.join(__dirname, "routes");
const TEMPLATE_DIR = path.join(__dirname, "routes", "tamplate", "html");
routes.use("/css", express.static(path.join(__dirname, "routes", "tamplate", "style")));
routes.use("/js", express.static(path.join(__dirname, "routes", "tamplate", "script")));

// 정적 파일 제공
routes.use("/pages", express.static(PAGES_DIR));

const mobileroutes = require("./routes/mobile/app");
const HRroutes = require("./routes/HR/app");
const userroutes = require("./routes/user/app");
routes.use("/mobile", mobileroutes);
routes.use("/HR", HRroutes);
routes.use("/user", userroutes);
// 기본 페이지 (root 요청)
routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "main", "pages", "html", "index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});


/**
 * 템플릿 렌더링
 */
function renderTemplate(pagePath) {
    const templatePath = path.join(TEMPLATE_DIR, "index.html");

    try {
        let template = fs.readFileSync(templatePath, "utf-8");
        const pageContent = fs.readFileSync(pagePath, "utf-8");

        return template.replace("<!-- MAIN_CONTENT -->", pageContent);
    } catch (err) {
        console.error("템플릿 렌더링 실패:", err);
        return null;
    }
}

module.exports = routes;