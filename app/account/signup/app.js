const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");

// 현재 회원가입 라우터 파일의 위치에 맞게 경로 조정
const {
  connectMongoDB
} = require("../../../database/mongodb");

const routes = express.Router();
const ROOT = __dirname;

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));
routes.use(express.static(ROOT));

const PAGES_DIR = path.join(ROOT, "pages");

const ID_REGEX = /^[a-zA-Z0-9._@-]{6,20}$/;
const NICK_REGEX = /^[a-zA-Z0-9가-힣]{2,20}$/;
const PHONE_REGEX = /^[0-9]{10,11}$/;

routes.use("/", express.static(PAGES_DIR));

routes.get("/", (req, res) => {
  return res.sendFile("register.html", {
    root: PAGES_DIR
  });
});

// ======================
// 아이디 중복 체크
// ======================
routes.post("/check-id", async (req, res) => {
  try {
    const userId = String(req.body.userId || "").trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "아이디 없음"
      });
    }

    if (!ID_REGEX.test(userId)) {
      return res.status(400).json({
        success: false,
        message: "아이디는 영문/숫자/. _ - @ 조합의 6~20자"
      });
    }

    const database = await connectMongoDB();
    const users = database.collection("users");

    // 아이디 검색
    const existingUser = await users.findOne(
      { userId },
      {
        projection: {
          _id: 1
        }
      }
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "이미 존재하는 아이디"
      });
    }

    return res.json({
      success: true,
      message: "사용 가능한 아이디입니다"
    });

  } catch (error) {
    console.error("아이디 확인 오류:", error);

    return res.status(500).json({
      success: false,
      message: "서버 오류"
    });
  }
});

// ======================
// 회원가입
// ======================
routes.post("/create", async (req, res) => {
  try {
    const userId = String(req.body.userId || "").trim();
    const password = String(req.body.password || "");
    const nickname = String(req.body.nickname || "").trim();

    // 하이픈과 공백 제거
    const phone = String(req.body.phone || "")
      .replace(/\D/g, "");

    if (!userId || !password || !nickname || !phone) {
      return res.status(400).json({
        success: false,
        message: "필수값 누락"
      });
    }

    if (!ID_REGEX.test(userId)) {
      return res.status(400).json({
        success: false,
        message: "아이디 형식 오류"
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "비밀번호는 4자 이상이어야 합니다"
      });
    }

    if (!NICK_REGEX.test(nickname)) {
      return res.status(400).json({
        success: false,
        message: "닉네임 형식 오류"
      });
    }

    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "전화번호 형식 오류"
      });
    }

    const database = await connectMongoDB();
    const users = database.collection("users");

    // 아이디와 전화번호 중복 방지
    await users.createIndex(
      { userId: 1 },
      { unique: true }
    );

    await users.createIndex(
      { phone: 1 },
      { unique: true }
    );

    // 비밀번호 해시 생성
    const passwordHash = await bcrypt.hash(password, 10);

    const passId =
      "PASS-" + Date.now().toString(36).toUpperCase();

    const userData = {
      userId,
      passwordHash,

      // password 평문은 저장하지 않음
      nickname,
      phone,
      passId,

      phoneVerified: false,
      status: "active",

      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await users.insertOne(userData);

    return res.status(201).json({
      success: true,
      message: "회원가입 성공",
      userId: result.insertedId
    });

  } catch (error) {
    // 아이디 또는 전화번호 중복
    if (error.code === 11000) {
      if (error.keyPattern?.userId) {
        return res.status(409).json({
          success: false,
          message: "이미 존재하는 아이디"
        });
      }

      if (error.keyPattern?.phone) {
        return res.status(409).json({
          success: false,
          message: "이미 등록된 전화번호"
        });
      }

      return res.status(409).json({
        success: false,
        message: "이미 등록된 회원정보"
      });
    }

    console.error("회원가입 오류:", error);

    return res.status(500).json({
      success: false,
      message: "서버 오류"
    });
  }
});

module.exports = routes;