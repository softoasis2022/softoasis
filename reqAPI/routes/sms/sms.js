const express = require("express");
const routes = express.Router();
const { SolapiMessageService } = require('solapi');
const messageService = new SolapiMessageService("NCS2LDAKE53KL5PR", "L5PTRYV4A0KSSMYVFVOC3VFUYRHQFWZG");

async function sms() {
    return await messageService.send({
        to: "01045171684",
        from: "01045171684",
        text: "[소프트오아시스] 테스트민섭"
    });
}

routes.post("/", async (req, res) => {
    const {phonenumber} = req.body;

    try {
        const result = await sms();

        console.log("문자 성공:", result);

        res.json({
            success: true,
            message: "문자 전송 완료"
        });

    } catch (e) {
        console.error("문자 실패:", e);

        res.status(500).json({
            success: false,
            message: "문자 전송 실패"
        });
    }
});

module.exports = routes;



