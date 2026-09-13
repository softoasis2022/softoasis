const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

const routes = express.Router();

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));
routes.use(cookieParser());

// 페이지 폴더
const PAGES_DIR = path.join(__dirname, "../pages");

// 관리자 세션 저장 폴더
const SESSION_DIR = path.join(
    "C:\\database",
    "adminSession",
    "adminSessionId"
);

// 관리자 세션 ID 생성
function generateSessionId() {
    return crypto.randomBytes(32).toString("hex");
}

// 로그인 페이지 CSS와 JS
routes.use(
    "/css",
    express.static(path.join(PAGES_DIR, "acount"))
);

routes.use(
    "/js",
    express.static(path.join(PAGES_DIR, "acount"))
);

// 로그인 페이지
routes.get("/login", async (req, res) => {
    try {
        const pagePath = path.join(
            PAGES_DIR,
            "acount",
            "login.html"
        );

        const result = await fs.promises.readFile(
            pagePath,
            "utf8"
        );

        return res.send(result);
    } catch (error) {
        console.error("로그인 페이지 읽기 실패:", error);

        return res.status(500).send(
            "로그인 페이지를 불러오지 못했습니다."
        );
    }
});

// 관리자 로그인
routes.post("/login", async (req, res) => {
    try {
        const adminId = String(
            req.body.adminId || ""
        ).trim();

        const password = String(
            req.body.password || ""
        );

        if (!adminId || !password) {
            return res.status(400).json({
                success: false,
                message: "아이디 또는 비밀번호가 누락되었습니다."
            });
        }

        // 파일 경로 조작 방지
        const adminIdPattern = /^[a-zA-Z0-9_-]{4,30}$/;

        if (!adminIdPattern.test(adminId)) {
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 올바르지 않습니다."
            });
        }

        // C:\database\admin\acount\hang05312.json
        const accountPath = path.join(
            "C:\\database",
            "admin",
            "acount",
            `${adminId}.json`
        );

        let account;

        try {
            const accountFile =
                await fs.promises.readFile(
                    accountPath,
                    "utf8"
                );

            account = JSON.parse(accountFile);
        } catch (error) {
            if (error.code === "ENOENT") {
                return res.status(401).json({
                    success: false,
                    message: "아이디 또는 비밀번호가 올바르지 않습니다."
                });
            }

            if (error instanceof SyntaxError) {
                console.error(
                    "관리자 계정 JSON 형식 오류:",
                    accountPath
                );

                return res.status(500).json({
                    success: false,
                    message: "관리자 계정 파일 형식 오류"
                });
            }

            throw error;
        }

        // 샘플 데이터의 id와 password 사용
        const savedAdminId = String(
            account.id || ""
        ).trim();

        const savedPasswordHash = String(
            account.password || ""
        );

        if (!savedAdminId || !savedPasswordHash) {
            console.error(
                "관리자 계정 파일에 id 또는 password가 없습니다."
            );

            return res.status(500).json({
                success: false,
                message: "관리자 계정 설정 오류"
            });
        }

        // 관리자 아이디 확인
        if (adminId !== savedAdminId) {
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 올바르지 않습니다."
            });
        }

        // 입력한 비밀번호와 저장된 해시 비교
        const passwordMatched = await bcrypt.compare(
            password,
            savedPasswordHash
        );

        if (!passwordMatched) {
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 올바르지 않습니다."
            });
        }

        // 관리자 세션 ID 생성
        const adminSessionId = generateSessionId();

        await fs.promises.mkdir(SESSION_DIR, {
            recursive: true
        });

        const sessionData = {
            adminId: savedAdminId,
            role: "admin",
            createdAt: new Date().toISOString(),
            expiresAt:
                Date.now() + (1000 * 60 * 60 * 24)
        };

        const sessionPath = path.join(
            SESSION_DIR,
            `${adminSessionId}.json`
        );

        await fs.promises.writeFile(
            sessionPath,
            JSON.stringify(sessionData, null, 2),
            {
                encoding: "utf8",
                flag: "wx"
            }
        );

        // admin.softoasis.org 전용 쿠키
        res.cookie(
            "adminSessionId",
            adminSessionId,
            {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24,
                path: "/"
            }
        );

        return res.redirect("/home");
    } catch (error) {
        console.error("관리자 로그인 오류:", error);

        return res.status(500).json({
            success: false,
            message: "로그인 처리 중 오류가 발생했습니다."
        });
    }
});

module.exports = routes;