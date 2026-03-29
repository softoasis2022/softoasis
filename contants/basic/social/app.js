const express = require("express");
const path = require("path");
const fs = require("fs");

const routes = express.Router();

const database = path.join("D:", "database", "contant");

routes.get("/:contantpartner/:contant", (req, res) => {

    try {

        const { contantpartner, contant } = req.params;
        const { roomnumber, usernumber } = req.query;

        const filePath = path.join(database,'contantpartner', contantpartner, `${contant}.json`);
        console.log("컨텐츠 파일 경로:", filePath);

        // 파일 존재 확인
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "컨텐츠 스키마를 찾을 수 없습니다."
            });
        }

        const contantschema = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

        // query 자동 생성
        const query = new URLSearchParams({
            roomnumber,
            usernumber
        }).toString();

        const finalUrl = `${contantschema.url}?${query}`;

        res.json({
            success: true,
            partner: contantpartner,
            contant: contant,
            rootUrl: contantschema.url,
            finalUrl: finalUrl
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "컨텐츠 처리 중 오류 발생",
            error: error.message
        });

    }

});

module.exports = routes;