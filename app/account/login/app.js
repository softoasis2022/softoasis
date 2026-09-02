const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// 로그인 라우터 파일 위치에 맞게 경로 조정
const {
  connectMongoDB
} = require("../../../database/mongodb");

const routes = express.Router();

const ROOT = __dirname;
const DATABASE_ROOT = path.join("C:", "database");
const PAGES_DIR = path.join(ROOT, "pages");

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));
routes.use(cookieParser());

routes.use("/css", express.static(PAGES_DIR));
routes.use("/js", express.static(PAGES_DIR));

function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

// ======================
// 로그인 페이지
// ======================
routes.get("/", (req, res) => {
  return res.sendFile("login.html", {
    root: PAGES_DIR
  });
});

// ======================
// 로그인 요청
// ======================
routes.post("/", async (req, res) => {
  const userId = String(req.body.userId || "").trim();
  const password = String(req.body.password || "");

  if (!userId || !password) {
    return res.status(400).json({
      success: false,
      message: "아이디 또는 비밀번호 누락"
    });
  }

  try {
    // ======================
    // MongoDB에서 유저 검색
    // ======================
    const mongoDatabase = await connectMongoDB();
    const users = mongoDatabase.collection("users");

    const userinfo = await users.findOne({
      userId: userId
    });

    // 보안을 위해 아이디가 없는 경우와
    // 비밀번호가 틀린 경우에 같은 메시지 사용
    if (!userinfo || !userinfo.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 일치하지 않습니다"
      });
    }

    // ======================
    // 비밀번호 비교
    // ======================
    const isMatch = await bcrypt.compare(
      password,
      userinfo.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 일치하지 않습니다"
      });
    }

    // 정지되거나 제한된 계정 확인
    if (userinfo.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "현재 사용할 수 없는 계정입니다"
      });
    }

    // ======================
    // 세션 생성
    // ======================
    const sessionId = generateSessionId();
    const sessionDir = path.join(
      DATABASE_ROOT,
      "session"
    );

    await fs.promises.mkdir(sessionDir, {
      recursive: true
    });

    const sessionData = {
      userId: userinfo.userId,
      mongoUserId: userinfo._id.toString(),
      nickname: userinfo.nickname,

      createdAt: new Date().toISOString(),

      // 24시간 후 만료
      expiresAt: Date.now() + (1000 * 60 * 60 * 24)
    };

    await fs.promises.writeFile(
      path.join(sessionDir, `${sessionId}.json`),
      JSON.stringify(sessionData, null, 2),
      "utf8"
    );

    // ======================
    // 세션 쿠키 설정
    // ======================
    res.cookie("sessionid", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".softoasis.org",
      maxAge: 1000 * 60 * 60 * 24,
      path: "/"
    });

    return res.json({
      success: true,
      message: "로그인 성공",
      user: {
        userId: userinfo.userId,
        nickname: userinfo.nickname
      }
    });

  } catch (error) {
    console.error("로그인 오류:", error);

    return res.status(500).json({
      success: false,
      message: "서버 오류"
    });
  }
});

module.exports = routes;