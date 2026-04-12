const express = require("express");
const fs = require("fs");
const path = require("path");
const routes = express.Router();

const databasepath = path.join("C:", "database", "chat")

routes.use("/js", express.static(path.join(__dirname, "../pages/room")));
routes.use("/css", express.static(path.join(__dirname, "../pages/room")));

//경로 /room 라우팅 완료

routes.use("/partnerinput",require("./partner"));

routes.use((req, res, next) => {
    //
    next();
});

// 파트너스,노드,컨텐트 
routes.get("/", (req, res) => {
<<<<<<< HEAD
    const {roomnumber, usernumber} = req.query;
    //채팅 내용
});
routes.get("/partners", (req, res) => {
    const {roomnumber, usernumber} = req.query;
    //JSON.parse(fs.readFileSync(path.join(databasepath,"room",`${roomnumber}.json`),"utf-8"));
    try{
        res.json(JSON.parse(fs.readFileSync(path.join(databasepath,"room",`${roomnumber}.json`),"utf-8")));
    }
    catch{
        res.status();
    }
=======
    const { roomnumber, usernumber } = req.query;
});
routes.get("/partners", (req, res) => {

    const { roomnumber, usernumber } = req.query;

>>>>>>> b43330d68af4bb348ee283a42364f76a0e353a7a
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