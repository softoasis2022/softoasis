const express = require("express");
const fs = require("fs");
const path = require("path");
const routes = express.Router();


routes.use("/js", express.static(path.join(__dirname, "../pages/room")));
routes.use("/css", express.static(path.join(__dirname, "../pages/room")));

//경로 /room 라우팅 완료


routes.use((req, res, next) => {
    //
    next();
});

// 파트너스,노드,컨텐트 
routes.get("/", (req, res) => {
    const { roomnumber, usernumber } = req.query;
});
routes.get("/partners", (req, res) => {

    const { roomnumber, usernumber } = req.query;

});
routes.get("/node", (req, res) => {
    const { roomnumber, usernumber } = req.query;
});
routes.get("/content", (req, res) => {
    const { roomnumber, usernumber } = req.query;
});
routes.post("/list", (req, res) => {
    const { usernumber } = req.headers; //헤더에서 usernumber 받아오기

    if (!usernumber) {
        return res.json({ success: false, message: "usernumber 필요" });
    }
    const result = [];

    for (let roomId in rooms) {
        if (rooms[roomId].includes(userId)) {
            result.push({
                roomId,
                users: rooms[roomId]
            });
        }
    }

    res.json({
        success: true,
        rooms: result
    });
});
// ======================
// ✅ 메시지 조회 API (추가)
// ======================
routes.get("/messages", (req, res) => {
    const { usernumber } = req.headers; //헤더에서 usernumber 받아오기

    if (!usernumber) {
        return res.json({ success: false, message: "usernumber 필요" });
    }

    const filePath = path.join(chatDB, `${roomId}.json`);

    if (!fs.existsSync(filePath)) {
        return res.json({ success: true, messages: [] });
    }

    const messages = JSON.parse(fs.readFileSync(filePath, "utf8"));

    res.json({
        success: true,
        messages
    });
});

module.exports = routes;