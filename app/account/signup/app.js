const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const routes = express.Router();
const ROOT = __dirname;

// 🔥 body 파싱 필수
routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

// 정적 파일
routes.use(express.static(ROOT));

const PAGES_DIR = path.join(ROOT, "pages");

// 사용자 데이터 폴더
const userDir = path.join("C:", "database", "app", "user");

// 아이디 규칙
const ID_REGEX = /^[a-zA-Z0-9._@-]{6,20}$/;

// 닉네임 규칙 (간단)
const NICK_REGEX = /^[a-zA-Z0-9가-힣]{2,20}$/;

// 폰번호 규칙
const PHONE_REGEX = /^[0-9]{10,11}$/;

// 폴더 생성
if (!fs.existsSync(userDir)) {
  fs.mkdirSync(userDir, { recursive: true });
}

// 페이지
routes.use("/", express.static(PAGES_DIR));

routes.get("/", (req, res) => {
  return res.sendFile("register.html", { root: PAGES_DIR });
});


/**
 * 1️⃣ 아이디 중복 체크
 */
routes.post("/check-id", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "아이디 없음" });
  }

  if (!ID_REGEX.test(userId)) {
    return res.status(400).json({
      message: "아이디는 영문/숫자/. _ - @ 조합의 6~20자",
    });
  }

  const userPath = path.join(userDir, `${userId}.json`);

  if (fs.existsSync(userPath)) {
    return res.status(409).json({ message: "이미 존재하는 아이디" });
  }

  return res.json({ message: "사용 가능" });
});


/**
 * 2️⃣ 회원가입
 */
routes.post("/create", async (req, res) => {
  try {
    const { userId, password, nickname, phone } = req.body;

    // 필수값
    if (!userId || !password || !nickname || !phone) {
      return res.status(400).json({ message: "필수값 누락" });
    }

    // 아이디 검사
    if (!ID_REGEX.test(userId)) {
      return res.status(400).json({ message: "아이디 형식 오류" });
    }

    // 비번
    if (password.length < 4) {
      return res.status(400).json({ message: "비밀번호 4자 이상" });
    }

    // 닉네임
    if (!NICK_REGEX.test(nickname)) {
      return res.status(400).json({ message: "닉네임 형식 오류" });
    }

    // 폰번호
    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({ message: "폰번호 형식 오류" });
    }

    const userPath = path.join(userDir, `${userId}.json`);

    // 중복 체크
    if (fs.existsSync(userPath)) {
      return res.status(409).json({ message: "이미 존재하는 아이디" });
    }

    // 🔥 passId (좀 더 안전)
    const passId = "PASS-" + Date.now().toString(36).toUpperCase();

    // 비번 해시
    const passwordHash = await bcrypt.hash(password, 10);

    const userData = {
      userId,
      passwordHash,
      nickname,
      phone,
      passId,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    // 🔥 비동기 저장
    await fs.promises.writeFile(
      userPath,
      JSON.stringify(userData, null, 2),
      "utf8"
    );

    return res.json({
      message: "출입증 발급 완료",
      passId,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = routes;