const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

// 페이지 폴더
const PAGES_DIR = path.join(__dirname, "pages");
const TEMPLATE_DIR = path.join(__dirname, "../tamplate", "html");

// /pages 경로로 정적 파일 제공
routes.use("/pages", express.static(PAGES_DIR));

/**
 * 특정 page.html 파일을 template/index.html 의 <main></main> 안에 삽입하는 함수
 */
function renderTemplate(pagePath) {
    const templatePath = path.join(TEMPLATE_DIR, "index.html");

    try {
        let template = fs.readFileSync(templatePath, "utf-8");
        const pageContent = fs.readFileSync(pagePath, "utf-8");

        // 템플릿 안의 <main>...</main> 영역을 교체
        template = template.replace(
            /<main[\s\S]*?<\/main>/,
            `<main>\n${pageContent}\n</main>`
        );

        return template;
    } catch (err) {
        console.error("템플릿 렌더링 실패:", err);
        return null;
    }
}

/**
 * 기본 페이지
 * / → template 의 <main> 안에 main/html/index.html 삽입해서 보여줌
 */
routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "main", "html", "index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});


/**
 * URL 요청 시 원하는 html을 템플릿에 삽입하여 응답하는 방식
 * 예: /load?page=user/login → pages/user/login.html 로드
 */
routes.get("/load", (req, res) => {
    const page = req.query.page;
    if (!page) return res.status(400).send("page 파라미터 필요함");

    const pagePath = path.join(PAGES_DIR, page + ".html");

    if (!fs.existsSync(pagePath)) {
        return res.status(404).send("페이지를 찾을 수 없음");
    }

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

module.exports = routes;