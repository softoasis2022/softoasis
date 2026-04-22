const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");

// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const database = path.join("C:", "database");
const PAGES_DIR = path.join(ROOT, "pages");

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));
routes.use(cookieParser());

// ✅ 2) 그 다음에 정적 파일 (style.css 등)
routes.use("/css", express.static(PAGES_DIR));
routes.use("/js", express.static(PAGES_DIR));


function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// ✅ 1) "/"는 라우트가 먼저 처리 (login.html을 직접 내려줌)
routes.get("/", (req, res) => {
  //console.log("PAGES_DIR:", PAGES_DIR);
  //console.log("files:", fs.readdirSync(PAGES_DIR));
  return res.sendFile("login.html", { root: PAGES_DIR });
});




routes.post("/", async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: "아이디 또는 비밀번호 누락" });
  }

  try {
    const userPath = path.join(database, "app", "user", `${userId}.json`);


    if (!fs.existsSync(userPath)) {
      return res.status(404).json({
        success: false,
        message: "존재하지 않는 사용자"
      });
    }

    const userinfo = JSON.parse(fs.readFileSync(userPath, "utf8"));

    // 🔥 핵심: bcrypt 비교
    const isMatch = await bcrypt.compare(password, userinfo.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "비밀번호가 일치하지 않습니다"
      });
    }

    // 🔥 로그인 성공
    const sessionId = generateRandomString(32);

    const sessionDir = path.join(database, "session");

    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(sessionDir, `${sessionId}.json`),
      JSON.stringify({
        userId: userinfo.userId
      })
    );

    res.cookie("sessionid", sessionId, {
      httpOnly: true,
      path: "/"
    });

    return res.json({
      success: true,
      message: "로그인 성공"
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "서버 오류"
    });
  }
});





module.exports = routes;