const express = require("express");
const routes  = express.Router();
const path = require("path");
const fs = require("fs");
const { json } = require("stream/consumers");

const database = path.join("Z:", "HDD1", "database");
const developerdatabase = path.join(__dirname,"database");
const PAGES_DIR = path.join(__dirname,"pages");
const TEMPLATE_PATH =path.join(__dirname, "./pages", "html", "tamplate.html");

routes.use("/css", express.static(path.join(__dirname, "css")));
routes.use("/js", express.static(path.join(__dirname, "js")));

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "main.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

function renderTemplate(pagePath) {
    const templatePath = path.join(TEMPLATE_PATH);

    try {
        let template = fs.readFileSync(templatePath, "utf-8");
        const pageContent = fs.readFileSync(pagePath, "utf-8");

        return template.replace("<!-- MAIN_CONTENT -->", pageContent);
    } catch (err) {
        console.error("템플릿 렌더링 실패:", err);
        return null;
    }
}



module.exports=routes;