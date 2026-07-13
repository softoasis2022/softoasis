const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const database = path.join("C:", "database");
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const PAGES_DIR = path.join(ROOT, "pages");
const TEMPLATE_PATH = path.join(PAGES_DIR, "html", "tamplate.html");

routes.use("/css", express.static(path.join(__dirname, "pages", "css")));
routes.use("/js", express.static(path.join(__dirname, "pages", "js")));



//쿼리 빌딩 번호

routes.get("/lobby", (req, res) => {
    //로비
    const { worldnumber, buidingnumber } = req.query;

    //빌딩 정보 가지고 오기
    fs.readFileSync(path.join(database, "world", worldnumber, "building", `${buidingnumber}.json`))


});

const buildingsetting = require("./func/Construction");

routes.get("/Construction", (req, res) => {
    //월드 번호
    const { worldnumber } = req.query;


    //월드의 타일정보르 가지고 오는 디비 루트
    const worldinfo = JSON.parse(fs.readFileSync(path.join(database, "world", worldnumber, "info.json"), "utf-8"));

    console.log(worldinfo.building.length);

    const result = fs.readFileSync(path.join(PAGES_DIR, "html", "Construction.html"), "utf-8")

    res.status(200).send(result);

});
routes.post("/Construction", (req, res) => {

    const {worldnumber} = req.query;

    let {
        buildingtype,
        tile,
        tilesize,
        name,
        rayer,
        object
    } = req.body;

    // 문자열로 들어오는 값 정수 변환
    tilesize = Number(tilesize);
    rayer = Number(rayer);
    object = Number(object);

    //post 로 요청
    //tile은 좌표값
    //name은 건물 이름
    //rayer은 층수
    //object는 층별상점 및 오브젝트 인입 갯수

    //빌딩 타입 검사
    if (buildingtype !== "building") {
        return res.status(400).json({
            success: false,
            message: "잘못된 건물 타입 입니다."
        });
    }

    //건물 이름 검사
    if (!name || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "건물 이름을 입력해 주세요."
        });
    }

    //타일 검사
    if (!tile) {
        return res.status(400).json({
            success: false,
            message: "타일 정보가 없습니다."
        });
    }

    //타일 형식 검사
    const tileRegex = /^\d+,\d+$/;

    if (!tileRegex.test(tile)) {
        return res.status(400).json({
            success: false,
            message: "타일 형식은 5,5 형태여야 합니다."
        });
    }

    //tilesize가 1타일일 경우 1층에 10개의 오브젝트까지 가능
    //그이하는 가능

    //타일 유효성 검사
    if (tilesize === 1) {
        //유효성에 적합한경우
    }
    else {
        //유효성에 적합 하지 않은 경우
        //"현제 1타일만 가능 합니다" 를 리턴
        return res.status(400).json({
            success: false,
            message: "현재 1타일만 가능 합니다."
        });
    }

    if (rayer >= 1 && rayer <= 15) {
        //1층부터 15층 까지 가능함
    }
    else {
        //현재 15층 까지만 가능 합니다.
        return res.status(400).json({
            success: false,
            message: "현재 15층 까지만 가능 합니다."
        });
    }

    //1타일 기준 층당 최대 오브젝트 수 검사
    if (object < 1 || object > 10) {
        return res.status(400).json({
            success: false,
            message: "1타일 건물은 층당 최대 10개의 오브젝트만 등록할 수 있습니다."
        });
    }

    //적합 검사가 끝난경우

    const buildingid =
        "building_" +
        Date.now();

    const buildingData = {
        worldnumber,
        buildingid,
        buildingtype,
        tile,
        tilesize,
        name,
        rayer,
        object,
        createdate: new Date().toISOString()
    };

    //빌딩 데이터 완성해서 디비에 저장
    //저장 루트는 아직 정하지 않았으니 콘솔 로그로 찍는다.

    //함수 불러옴
    // "./func/Construction.js"
    const result = buildingsetting.buidingsetting(buildingData);
    console.log(result);

    console.log("건물 생성");
    console.log(buildingData);

    return res.status(200).json({
        success: true,
        message: "건물 생성 완료",
        data: buildingData
    });

});


function renderTemplate(pagePath) {
    const templatePath = path.join(TEMPLATE_PATH);
    console.log(templatePath);
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