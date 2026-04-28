const express = require("express");
const path = require("path");
const fs = require("fs");

const routes = express.Router();

const SESSION_DIR = path.join("C:", "database", "session");

routes.post("/", (req, res) => {
    const cookies = req.cookies;

    // 🔥 1. 세션 삭제 (logid 기준)
    const logid = cookies?.logid;

    if (logid) {
        const sessionPath = path.join(SESSION_DIR, `${logid}.json`);

        if (fs.existsSync(sessionPath)) {
            fs.unlinkSync(sessionPath);
        }
    }

    // 🔥 2. 쿠키 삭제
    if (cookies) {
        for (const cookieName in cookies) {
            res.clearCookie(cookieName, {
                path: "/",
                // ❗ 실제 생성 옵션과 동일하게 맞춰야 함
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });
        }
    }

    // 🔥 3. 응답
    return res.status(200).json({
        success: true,
        message: "로그아웃 완료"
    });
});

module.exports = routes;