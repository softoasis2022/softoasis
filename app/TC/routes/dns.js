const express = require("express");
const path = require("path");
const fs = require("fs");

const routes = express.Router();
const parseUrlData = require("../func/urlaparse");

const database = path.join("C:", "database");

// ======================
// 정적 파일
// ======================
const ROOT = __dirname;
routes.use("/css", express.static(path.join(ROOT, "pages", "css")));
routes.use("/js", express.static(path.join(ROOT, "pages", "js")));

// ======================
// 🔥 DNS 존재 확인
// ======================
routes.post("/read", (req, res) => {

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: "url이 없습니다"
        });
    }

    const result = parseUrlData(url);

    if (!result.success) {
        return res.status(400).json(result);
    }

    const parsedData = result.data;
    const dnsFolder = path.join(database, "dns");
    const filePath = path.join(dnsFolder, `${parsedData.domain}.json`);

    const exists = fs.existsSync(filePath);

    return res.json({
        success: true,
        message : "페이지 등록 성공"
    });
});

// ======================
// 🔥 DNS 저장
// ======================
routes.post("/create", (req, res) => {

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: "url이 없습니다"
        });
    }

    const result = parseUrlData(url);

    if (!result.success) {
        return res.status(400).json(result);
    }

    const parsedData = result.data;

    try {
        const dnsFolder = path.join(database, "dns");

        if (!fs.existsSync(dnsFolder)) {
            fs.mkdirSync(dnsFolder, { recursive: true });
        }

        const filePath = path.join(dnsFolder, `${parsedData.domain}.json`);

        let fileData = [];

        if (fs.existsSync(filePath)) {
            fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }

        fileData.push(parsedData);

        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

        return res.json({
            success: true,
            message: "저장 완료",
            domain: parsedData.domain
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "서버 오류"
        });
    }
});

// ======================
// 템플릿 렌더링
// ======================
function renderTemplate(pagePath) {
    try {
        const template = fs.readFileSync(
            path.join(ROOT, "pages", "html", "tamplate.html"),
            "utf-8"
        );

        const pageContent = fs.readFileSync(pagePath, "utf-8");

        return template.replace("<!-- MAIN_CONTENT -->", pageContent);

    } catch (err) {
        console.error("템플릿 렌더링 실패:", err);
        return null;
    }
}

module.exports = routes;