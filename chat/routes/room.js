const express = require("express");
const fs = require("fs");
const path = require("path");
const { json } = require("stream/consumers");
const routes = express.Router();

const databasepath = path.join("C:", "database")

routes.use("/js", express.static(path.join(__dirname, "../pages/room")));
routes.use("/css", express.static(path.join(__dirname, "../pages/room")));

//경로 /room 라우팅 완료




routes.use("/partnerinput", require("./partner"));

routes.get("/node", (req, res) => {
    const { roomnumber, usernumber } = req.query;
});
routes.get("/content", (req, res) => {
    const { roomnumber, usernumber } = req.query;
});
routes.post("/list", (req, res) => {
    const { usernumber } = req.headers;

    if (!usernumber) {
        return res.json({ success: false, message: "usernumber 필요" });
    }

    const filePath = path.join(databasepath,"app", "user", "info", `${usernumber}.json`);

    if (!fs.existsSync(filePath)) {
        return res.json({
            success: true,
            rooms: []
        });
    }

    try {
        const data = JSON.parse(
            fs.readFileSync(filePath, "utf-8")
        );

        const rooms = data.chat?.room || [];

        console.log("rooms:", rooms);

        res.json({
            success: true,
            rooms
        });

    } catch (err) {
        res.json({
            success: false,
            message: "파일 파싱 오류"
        });
    }
});
routes.post("/info", (req, res) => {

    const { roomnumber, usernumber } = req.body;

    // 🔥 1. 필수값 체크
    if (!roomnumber || !usernumber) {
        return res.json({
            success: false,
            message: "roomnumber / usernumber 필요"
        });
    }
    console.log(roomnumber);
    try {
        const filePath = path.join(databasepath, "chat", "room", `${roomnumber}.json`);

        // 🔥 2. 방 존재 확인
        if (!fs.existsSync(filePath)) {
            return res.json({
                success: false,
                message: "방 없음"
            });
        }

        // 🔥 3. 파일 읽기
        const data = JSON.parse(
            fs.readFileSync(filePath, "utf-8")
        );
        console.log(data);
        // 🔥 5. 정상 응답
        res.json({
            success: true,
            room: data
        });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "파싱 오류"
        });
    }
});


// ======================
// 🔥 메시지 조회
// ======================
routes.post("/messages", (req, res) => {

    const { usernumber, roomnumber } = req.body;
    console.log(roomnumber);
    // 🔥 1. 필수값 체크
    if (!usernumber || !roomnumber) {
        return res.json({
            success: false,
            message: "usernumber / roomnunber 필요"
        });
    }
    try {
        const filePath = path.join(databasepath, "chat", "room", `${roomnumber}.json`);

        // 🔥 2. 메시지 파일 없으면 빈 배열
        if (!fs.existsSync(filePath)) {
            console.log(fs.existsSync(filePath));
            return 
        }

        // 🔥 3. 메시지 읽기
        const chatlist = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        ).chatlist;

        const chatfilePath = path.join(databasepath, "chat", "speaklist", `${chatlist}.json`);
        
        // 🔥 2. 메시지 파일 없으면 빈 배열
        if (!fs.existsSync(chatfilePath)) {
            console.log(fs.existsSync(chatfilePath));
            return res.json({
                success: true,
                messages: []
            });
        }
        const messages = JSON.parse(fs.readFileSync(chatfilePath,"utf-8"));
        console.log(messages);
        // 🔥 4. 응답
        res.json({
            success: true,
            messages
        });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "메시지 파싱 오류"
        });
    }
});


module.exports = routes;