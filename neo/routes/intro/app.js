const express = require("express");
const routes = express.Router();
const path = require("path");

// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로

const PAGES_DIR = path.join(ROOT, "pages");
routes.use(express.static(ROOT));

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(pagePath);
});


routes.use("/js", express.static(path.join(PAGES_DIR,"js")));
routes.use("/css", express.static(path.join(PAGES_DIR,"css")));

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

module.exports = routes;