//station

const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const database = path.join("C:", "database");
// 네 환경 그대로
const PAGES_DIR = path.join(__dirname,"pages");
const TEMPLATE_PATH = path.join(__dirname,"pages","html","tamplate.html");

routes.use("/pages", express.static(path.join(__dirname, "pages")));

routes.use("/css", express.static(path.join(__dirname, "pages","css")));
routes.use("/js", express.static(path.join(__dirname, "pages","js")));

// 페이지
routes.get("/:townnumber", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 오류");

    res.send(result);
});

// 데이터
routes.get("/:townnumber/data", (req, res) => {
    const { townnumber } = req.params;

    const townpath = path.join(database, "world", "town", `${townnumber}.json`);

    if (!fs.existsSync(townpath)) {
        return res.status(404).json({ error: "데이터 없음" });
    }

    res.status(200).json(
        JSON.parse(fs.readFileSync(townpath, "utf-8"))
    );
});

/**
 * 템플릿 렌더링
 */
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
