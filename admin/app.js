const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const PAGES_DIR = path.join(__dirname, "pages");
const TEMPLATE_DIR = path.join(__dirname, "routes", "tamplate", "html");
routes.use("/css", express.static(path.join(__dirname, "routes", "tamplate", "style")));
routes.use("/js", express.static(path.join(__dirname, "routes", "tamplate", "script")));

// 정적 파일 제공
routes.use("/pages", express.static(PAGES_DIR));

const mobileroutes = require("./routes/mobile"); 
const HRroutes = require("./routes/HR");
const userroutes = require("./routes/user");
const approutes =  require("./routes/home");
routes.use("/mobile", mobileroutes);
routes.use("/HR", HRroutes);
routes.use("/home", approutes);
routes.use("/user", userroutes);




routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html","home","index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/mobile", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html","mobile","index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/user", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html","user","index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/HR", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html","home","HR.html");

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