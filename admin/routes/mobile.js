const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const PAGES_DIR = path.join(__dirname, "../pages" , "mobile");
const TEMPLATE_DIR = path.join(__dirname ,"../pages", "tamplate", "tamplate.html");
routes.use("/css", express.static(path.join(__dirname,"pages","css")));
routes.use("/js", express.static(path.join(__dirname,"pages","js")));

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/deviceprofile", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"deviceprofile.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/devicepofileedit", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"devicepofileedit.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/deviceprofileregister", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"deviceprofileregister.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"intro.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
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