const express = require("express");
const routes = express.Router();
const path = require("path");
const fs = require("fs");
const { getNextDeliveryTime } = require("./func/deliveryTime");
const { getServerTimeString } = require("./func/Time");
const { generateRandomString } = require("./func/RandomString");
const { sendSMS } = require("../../../../api/routes/sms/sms");
const { getStaffMessage, getCustomerMessage } = require("./func/message");



const database = path.join("C:", "database", "delivery");
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const PAGES_DIR = path.join(ROOT, "pages");
const TEMPLATE_PATH = path.join(PAGES_DIR, "html", "tamplate.html");

routes.use("/css", express.static(path.join(__dirname, "pages", "css")));
routes.use("/js", express.static(path.join(__dirname, "pages", "js")));


routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/join", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "join.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/status", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "Deliverystatus.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/cs", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "cs.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/staffjoin", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "staffjoin.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

routes.get("/postinfo", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "staffjoin.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

// 🔥 배송 신청 처리
routes.post("/join", async (req, res) => {
    const { storename = "홈마트 시지점", name, phone, address,subaddress,request,status = "ready" } = req.body;

    const postnumber = generateRandomString();
    const deliveryTime = getNextDeliveryTime();
    const joinTime = getServerTimeString();
    const dir = path.join(database, "post",phone);

    // 🔥 DB 저장 자리
    console.log({
        storename,
        name,
        phone,
        address,
        deliveryTime
    });

    // 🔥 메시지 생성
    const staffMessage = getStaffMessage({
        storename,
        name,
        phone,
        address,
        subaddress,
        deliveryTime
    });

    const customerMessage = getCustomerMessage({
        storename,
        name,
        deliveryTime
    });

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir,`${postnumber}.json`), JSON.stringify({
        storename,
        name,
        phone,
        address,
        subaddress,
        deliveryTime,
        status,
        request,
        joinTime
    }, null, 2), "utf-8");

    //문자 보내기 핵심 코드
    await sendSMS("01045171684", staffMessage);
    await sendSMS(phone, customerMessage);

    res.json({
        success: true,
        deliveryTime
    });
});
// 🔥 배송 신청 처리
routes.post("/staffjoin", async (req, res) => {
    const { storename = "홈마트 시지점", name, phone, address,subaddress,request,status = "ready" } = req.body;

    const postnumber = generateRandomString();
    const deliveryTime = getNextDeliveryTime();
    const joinTime = getServerTimeString();
    const dir = path.join(database, "post",phone);

    const staffMessage = getStaffMessage({
        storename,
        name,
        phone,
        address,
        subaddress,
        deliveryTime
    });

    const customerMessage = getCustomerMessage({
        storename,
        name,
        deliveryTime
    });

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir,`${postnumber}.json`), JSON.stringify({
        storename,
        name,
        phone,
        address,
        subaddress,
        deliveryTime,
        status,
        request,
        joinTime
    }, null, 2), "utf-8");

    //문자 보내기 핵심 코드
    await sendSMS("01045171684", staffMessage);
    await sendSMS(phone, customerMessage);

    res.json({
        success: true,
        deliveryTime
    });
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