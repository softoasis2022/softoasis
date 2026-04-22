const express = require("express");
const routes = express.Router();
const { SolapiMessageService } = require('solapi');
const messageService = new SolapiMessageService("NCS2LDAKE53KL5PR", "L5PTRYV4A0KSSMYVFVOC3VFUYRHQFWZG");

async function sms(phonenumber,message) {
    return await messageService.send({
        to: "01045171684",
        from: phonenumber,
        text: message
    });
}

routes.post("/", async (req, res) => {
    const {phonenumber,message} = req.body;

    try {
        const result = await sms(phonenumber,message);

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



