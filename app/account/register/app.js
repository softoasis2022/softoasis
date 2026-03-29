const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const routes = express.Router();
const ROOT = __dirname;

// 정적 파일
routes.use(express.static(ROOT));
//routes.use(express.static(imgDB));

const PAGES_DIR = path.join(ROOT, "pages");

// 사용자 데이터 저장 폴더
const userDir = path.join("C:", "database", "app", "user");

// 아이디 규칙: 영문/숫자/특수(. _ - @) 6~20자
const ID_REGEX = /^[a-zA-Z0-9._@-]{6,20}$/;

// 폴더 없으면 생성
if (!fs.existsSync(userDir)) {
  fs.mkdirSync(userDir, { recursive: true });
}
routes.use("/", express.static(PAGES_DIR));
routes.get("/",(req,res)=>{
  return res.sendFile("register.html", { root: PAGES_DIR });
});



/**
 * 1) 아이디 중복 체크
 * POST /register/check-id
 * body: { userId: "test_user" }
 */
routes.post("/check-id", (req, res) => {
  const userId = req.body?.userId;

  if (!userId) {
    return res.status(400).json({ message: "아이디 없음" });
  }

  if (!ID_REGEX.test(userId)) {
    return res.status(400).json({
      message: "아이디는 영문/숫자/. _ - @ 조합의 6~20자만 가능합니다",
    });
  }

  const userPath = path.join(userDir, `${userId}.json`);

  if (fs.existsSync(userPath)) {
    return res.status(409).json({ message: "이미 존재하는 아이디" });
  }

  return res.status(200).json({ message: "사용 가능", userId });
});

/**
 * 2) 출입증 발급(회원가입)
 * POST /register/create
 * body: { userId, password }
 */
routes.post("/create", async (req, res) => {
  const userId = req.body?.userId;
  const password = req.body?.password;

  if (!userId || !password) {
    return res.status(400).json({ message: "아이디 또는 비밀번호 누락" });
  }

  if (!ID_REGEX.test(userId)) {
    return res.status(400).json({
      message: "아이디는 영문/숫자/. _ - @ 조합의 6~20자만 가능합니다",
    });
  }

  if (String(password).length < 4) {
    return res.status(400).json({ message: "비밀번호는 4자 이상이어야 합니다" });
  }

  const userPath = path.join(userDir, `${userId}.json`);

  // 중복 체크
  if (fs.existsSync(userPath)) {
    return res.status(409).json({ message: "이미 존재하는 아이디" });
  }

  // 출입증 번호 생성
  const passId = Math.random().toString(36).substring(2, 8).toUpperCase();

  // 비밀번호 해시
  const passwordHash = await bcrypt.hash(password, 10);

  const userData = {
    userId,
    passwordHash,
    passId,
    createdAt: new Date().toISOString(),
    status: "active",
  };

  fs.writeFileSync(userPath, JSON.stringify(userData, null, 2), "utf8");

  return res.status(200).json({
    message: "출입증 발급 완료",
    passId,
  });
});

module.exports = routes;
