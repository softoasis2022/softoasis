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
    const { usernumber } = req.headers; //헤더에서 usernumber 받아오기

    if (!usernumber) {
        return res.json({ success: false, message: "usernumber 필요" });
    }

    const result = json.parse(fs.readFileSync(path.join(databasepath,"user", `${usernumber}.json`),"utf-8")).

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