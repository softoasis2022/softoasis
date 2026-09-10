const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const PAGES_DIR = path.join(__dirname, "../pages" , "order");
const TEMPLATE_DIR = path.join(__dirname ,"../pages", "tamplate", "tamplate.html");
routes.use("/css", express.static(path.join(PAGES_DIR)));
routes.use("/js", express.static(path.join(PAGES_DIR)));

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"main.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/placing", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"placing.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/shipping", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"shipping.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/purchase-confirmation", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"main.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/cancel", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"main.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/return", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"main.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/exchange", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"main.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/restricted-customer", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"main.html");

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