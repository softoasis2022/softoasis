const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

// 페이지 폴더
const database = path.join("C:", "database");
const PAGES_DIR = path.join(__dirname, "../../pages");
const TEMPLATE_DIR = path.join(__dirname, "../../pages", "tamplate", "tamplate.html");
routes.use("/css", express.static(path.join(PAGES_DIR)));
routes.use("/js", express.static(path.join(PAGES_DIR)));

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "HR", "member.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

routes.get("/info", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "HR", "memberinfo.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.post("/", (req, res) => {

    try {
        const filePath = path.join(database, "HR", "member.json");
        const fileData = fs.readFileSync(filePath, "utf-8");
        const raw = JSON.parse(fileData);
        res.json(raw);
    }
    catch {

    }
    finally {

    }
});

function renderTemplate(pagePath) {
    const templatePath = path.join(TEMPLATE_DIR);

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