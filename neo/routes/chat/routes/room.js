const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

const routes = express.Router();
routes.use(cookieParser());
routes.use(express.json());

const databasepath = path.join("C:", "database");

// 정적 파일
routes.use("/js", express.static(path.join(__dirname, "../pages/room")));
routes.use("/css", express.static(path.join(__dirname, "../pages/room")));

// ======================
// 🔥 세션 기반 유저 찾기
// ======================
routes.use((req, res, next) => {
    const sessionpath = path.join(databasepath, "session");
    const sessionid = req.cookies?.sessionid;
    //console.log(sessionid);

    if (!sessionid) {
        req.userid = null;
        return next();
    }

    try {
        const filePath = path.join(sessionpath, `${sessionid}.json`);

        if (!fs.existsSync(filePath)) {
            req.userid = null;
            return next();
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        req.userid = data.userid;

    } catch (err) {
        console.log("세션 오류:", err);
        req.userid = null;
    }

    next();
});

// ======================
// 🔥 로그인 체크 미들웨어 (추가)
// ======================
function requireLogin(req, res, next) {
    if (!req.userid) {
        return res.status(401).json({
            success: false,
            message: "로그인 필요"
        });
    }
    next();
}

// ======================
// 🔥 채팅방 리스트
// ======================
routes.post("/list", requireLogin, (req, res) => {

    const filePath = path.join(
        databasepath,
        "app",
        "user",
        "info",
        `${req.userid}.json`
    );

    if (!fs.existsSync(filePath)) {
        return res.json({
            success: true,
            rooms: []
        });
    }

    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const rooms = data.chat?.room || [];

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

// ======================
// 🔥 방 정보
// ======================
routes.post("/info", requireLogin, (req, res) => {

    const { roomnumber } = req.body;

    if (!roomnumber) {
        return res.json({
            success: false,
            message: "roomnumber 필요"
        });
    }

    try {
        const filePath = path.join(databasepath, "chat", "room", `${roomnumber}.json`);

        if (!fs.existsSync(filePath)) {
            return res.json({
                success: false,
                message: "방 없음"
            });
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        res.json({
            success: true,
            room: data
        });

    } catch (err) {
        res.json({
            success: false,
            message: "파싱 오류"
        });
    }
});

// ======================
// 🔥 메시지 조회
// ======================
routes.post("/messages", requireLogin, (req, res) => {

    const { roomnumber } = req.body;

    if (!roomnumber) {
        return res.json({
            success: false,
            message: "roomnumber 필요"
        });
    }

    try {
        const filePath = path.join(databasepath, "chat", "room", `${roomnumber}.json`);

        if (!fs.existsSync(filePath)) {
            return res.json({
                success: true,
                messages: []
            });
        }

        const roomData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const chatlist = roomData.chatlist;

        const chatfilePath = path.join(
            databasepath,
            "chat",
            "speaklist",
            `${chatlist}.json`
        );

        if (!fs.existsSync(chatfilePath)) {
            return res.json({
                success: true,
                messages: []
            });
        }

        const messages = JSON.parse(fs.readFileSync(chatfilePath, "utf-8"));

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