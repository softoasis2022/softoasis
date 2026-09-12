const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();
routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

const PAGES_DIR = path.join(__dirname, "./pages");
const TEMPLATE_DIR = path.join(PAGES_DIR, "html", "tamplate.html");
routes.use("/css", express.static(path.join(PAGES_DIR, "css")));
routes.use("/js", express.static(path.join(PAGES_DIR, "js")));

routes.use("/schedule",require("./routes/schedule"));

routes.get("/", (req, res) => {
    const { calendernumber } = req.body;
    console.log(calendernumber);

    //session

    //캘린더번호를 디비에서 조회후 share레벨 확인해서 true면 다음 false면 접근자 확인
    //점급자가 본인이면 패쓰
    //접근자가 다른 사람이면 공유단계확인후 응답


    const pagePath = path.join(PAGES_DIR, "html", "main.html");

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