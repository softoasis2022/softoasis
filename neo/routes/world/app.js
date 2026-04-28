const express = require("express"); 
const path = require("path"); 
const fs = require("fs");
const routes = express.Router();

const PAGES_DIR = path.join(__dirname,"./routes","world","pages");
const TEMPLATE_PATH = path.join(__dirname,"./routes","world","pages","html","tamplate.html");

routes.use("/css", express.static(path.join(PAGES_DIR,"css")));
routes.use("/js", express.static(path.join(PAGES_DIR,"js")));

const town = require("./routes/town/app");
const station = require("./routes/station/app");
const pass = require("./routes/pass/app");

routes.use("/town", town);
routes.use("/station", station);
routes.use("/pass", pass);


routes.use((req)=>{
    //로그인이 되서 쿠키에 sessionid가 있거나
    //로그인이 안되서 쿠키에 sessionid가 없거나
    //없다면 로그인 으로
    //있다면 해당 쿠키로 아이디 조회해서 요청 쿠키에 neoid값 넣어 주기
    //neoid값은 디비에 저장
    
})

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "world.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

routes.get("/create", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "world.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
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
