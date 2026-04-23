const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const routes = express.Router();
const ROOT = __dirname;

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

routes.use(express.static(ROOT));

const PAGES_DIR = path.join(ROOT, "pages");
const userDir = path.join("C:", "database", "app", "user");

const ID_REGEX = /^[a-zA-Z0-9._@-]{6,20}$/;
const NICK_REGEX = /^[a-zA-Z0-9가-힣]{2,20}$/;
const PHONE_REGEX = /^[0-9]{10,11}$/;

if (!fs.existsSync(userDir)) {
  fs.mkdirSync(userDir, { recursive: true });
}

routes.use("/", express.static(PAGES_DIR));

routes.get("/", (req, res) => {
  return res.sendFile("register.html", { root: PAGES_DIR });
});


// ======================
// 🔥 아이디 중복 체크
// ======================
routes.post("/check-id", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.json({
      success: false,
      message: "아이디 없음"
    });
  }

  if (!ID_REGEX.test(userId)) {
    return res.json({
      success: false,
      message: "아이디는 영문/숫자/. _ - @ 조합의 6~20자"
    });
  }

  const userPath = path.join(userDir, `${userId}.json`);

  if (fs.existsSync(userPath)) {
    return res.json({
      success: false,
      message: "이미 존재하는 아이디"
    });
  }

  return res.json({
    success: true,
    message: "사용 가능한 아이디 입니다"
  });
});


// ======================
// 🔥 회원가입 (암호화 제거)
// ======================
routes.post("/create", async (req, res) => {
  try {
    const { userId, password, nickname, phone } = req.body;

    if (!userId || !password || !nickname || !phone) {
      return res.json({
        success: false,
        message: "필수값 누락"
      });
    }

    if (!ID_REGEX.test(userId)) {
      return res.json({
        success: false,
        message: "아이디 형식 오류"
      });
    }

    if (password.length < 4) {
      return res.json({
        success: false,
        message: "비밀번호 4자 이상"
      });
    }

    if (!NICK_REGEX.test(nickname)) {
      return res.json({
        success: false,
        message: "닉네임 형식 오류"
      });
    }

    if (!PHONE_REGEX.test(phone)) {
      return res.json({
        success: false,
        message: "폰번호 형식 오류"
      });
    }

    const userPath = path.join(userDir, `${userId}.json`);

    if (fs.existsSync(userPath)) {
      return res.json({
        success: false,
        message: "이미 존재하는 아이디"
      });
    }

    const passId = "PASS-" + Date.now().toString(36).toUpperCase();


    //passwordHash는 bcrypt를 사용해서 저장
    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {
      userId,
      passwordHash,
      password, // 🔥 평문 저장 (암호화 제거)
      nickname,
      phone,
      passId,
      createdAt: new Date().toISOString(),
      status: "active"
    };

    await fs.promises.writeFile(
      userPath,
      JSON.stringify(userData, null, 2),
      "utf8"
    );

    return res.json({
      success: true,
      message: "회원가입 성공"
    });

  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "서버 오류"
    });
  }
});

module.exports = routes;