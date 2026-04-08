const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

// 페이지 폴더
const database = path.join("C:", "database");
const PAGES_DIR = path.join(__dirname, "../../pages");
const TEMPLATE_DIR = path.join(__dirname, "../../pages", "tamplate", "tamplate.html");
routes.use("/css", express.static(path.join(PAGES_DIR)));
routes.use("/js", express.static(path.join(PAGES_DIR)));

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "HR", "task.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/input", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "HR", "taskinput.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.post("/input", (req, res) => {
    //업무분류("긴급","기존업무 연게",),업무이름,담당부서,담당자,전달부서(업무후 전달할 부서 : 전달부서가 없어도됨),업무내용
    //서버 기준: 업무등록 시간[업무등록시간은 서버 시간 기준으로 저장], 업무번호 부여[업무 번호는 "./task.json"에서 데이터를 가져와서 json데이터에 number를 +1올리고 가져온 넘버를 업무번호로 부여]
    //업무상태(키 : state)는 새로등록이기때문에 무조건 "등록"이다

    const { name, }= req.body;
    const inputPath = path.join(database, "task");

    //inputPath에 저장

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
//  경로 /update  post
routes.post("/update/:action",(req,res)=>{
    //업무
    // 업무 이동 타임 라인(리스트형식 : 업무 이름,)
    //action 은 업무이동(루트 아직 못정함),업무상태변경(루트 아직 못정함 : ),
    //업무 수신자(해당업무를 바톤터치 하는 )
    //모든 서버요청의 요청 데이터는 요청자를 기준으로 한다. 업무담당자와 업데이트요청자가 다를수 있음
    const { action } = req.params;
    const {tasknumber,memberid} = req.body
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