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

// 로그인 페이지 폴더
const PAGES_DIR = path.join(__dirname, "./pages");

// 셀러 계정 저장 폴더
const ACCOUNT_DIR = path.join(
    "C:\\database",
    "seller",
    "user"
);

// 셀러 세션 저장 폴더
const SESSION_DIR = path.join(
    "C:\\database",
    "sellerSession"
);

// 세션 유효시간: 24시간
const SESSION_MAX_AGE = 1000 * 60 * 60 * 24;

// 셀러 세션 ID 생성
function generateSessionId() {
    return crypto.randomBytes(32).toString("hex");
}

// 로그인 페이지 CSS와 JS
routes.use(
    "/css",
    express.static(path.join(PAGES_DIR, "css"))
);

routes.use(
    "/js",
    express.static(path.join(PAGES_DIR, "js"))
);

// 로그인 페이지
routes.get("/", async (req, res) => {
    try {
        const pagePath = path.join(
            PAGES_DIR,
            "index.html"
        );

        const html = await fs.promises.readFile(
            pagePath,
            "utf8"
        );

        return res.send(html);
    } catch (error) {
        console.error("셀러 로그인 페이지 읽기 실패:", error);

        return res.status(500).send(
            "로그인 페이지를 불러오지 못했습니다."
        );
    }
});

// 셀러 로그인
routes.post("/", async (req, res) => {
    try {
        const { userId: rawUserId, password } = req.body || {};

        if (
            typeof rawUserId !== "string" ||
            typeof password !== "string" ||
            !rawUserId.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "아이디와 비밀번호를 모두 입력해주세요."
            });
        }

        const userId = rawUserId.trim();

        // 파일 경로 조작 방지
        const userIdPattern = /^[a-zA-Z0-9_-]{4,30}$/;

        if (!userIdPattern.test(userId)) {
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 올바르지 않습니다."
            });
        }

        // C:\database\seller\user\{userId}.json
        const accountPath = path.join(
            ACCOUNT_DIR,
            `${userId}.json`
        );

        let account;

        try {
            const accountFile = await fs.promises.readFile(
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

            // 파일 손상 등 상세 원인은 서버에만 기록
            throw error;
        }

        // 계정 파일의 id와 password 사용
        if (
            !account ||
            typeof account.id !== "string" ||
            typeof account.password !== "string" ||
            !account.id.trim() ||
            !account.password
        ) {
            throw new Error(
                "셀러 계정 파일에 올바른 id 또는 password가 없습니다."
            );
        }

        const savedUserId = account.id.trim();
        const savedPasswordHash = account.password;

        if (userId !== savedUserId) {
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 올바르지 않습니다."
            });
        }

        // 비밀번호와 저장된 bcrypt 해시 비교
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

        const sellerSessionId = generateSessionId();
        const now = Date.now();

        await fs.promises.mkdir(SESSION_DIR, {
            recursive: true
        });

        const sessionData = {
            userId: savedUserId,
            role: "seller",
            createdAt: new Date(now).toISOString(),
            expiresAt: now + SESSION_MAX_AGE
        };

        const sessionPath = path.join(
            SESSION_DIR,
            `${sellerSessionId}.json`
        );

        await fs.promises.writeFile(
            sessionPath,
            JSON.stringify(sessionData, null, 2),
            {
                encoding: "utf8",
                flag: "wx"
            }
        );

        // 이 응답을 보내는 호스트 전용 쿠키
        // seller.softoasis.org에서 응답하면 해당 호스트 전용
        res.cookie("sellerSessionId", sellerSessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: SESSION_MAX_AGE,
            path: "/"
        });

        // POST 로그인 처리 후 GET으로 셀러 페이지 이동
        return res.redirect(303, "/");
    } catch (error) {
        console.error("셀러 로그인 오류:", error);

        return res.status(500).json({
            success: false,
            message: "로그인 처리 중 오류가 발생했습니다."
        });
    }
});

module.exports = routes;