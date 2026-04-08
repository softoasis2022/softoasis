const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

// 페이지 폴더
const PAGES_DIR = path.join(__dirname, "../pages");
const TEMPLATE_DIR = path.join(__dirname, "../pages","tamplate", "tamplate.html");
routes.use("/css", express.static(path.join(PAGES_DIR,"acount")));
routes.use("/js", express.static(path.join(PAGES_DIR,"acount")));

routes.get("/login", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"acount","login.html");

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