const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();



// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const database = path.join("D:", "database");
const PAGES_DIR = path.join(ROOT, "pages");
const imgDB= path.join(database, "image");
const TEMPLATE_PATH = path.join(PAGES_DIR, "tamplate", "index.html");
const postnews = require("./routes/news");

routes.use("/css/tamplate", express.static(path.join(PAGES_DIR,"tamplate","style")));

routes.use("/css/main", express.static(path.join(PAGES_DIR,"main","style")));
routes.use("/js/main", express.static(path.join(PAGES_DIR,"main","script")));

// 정적 파일
routes.use(express.static(ROOT));
routes.use(express.static(imgDB));

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

// 검색 POST
routes.use("/news",postnews); 


routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"main","html","main.html");

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

module.exports = routes;
