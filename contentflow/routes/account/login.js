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
const PAGES_DIR = path.join(ROOT, "../../pages");
const TEMPLATE_PATH = path.join(PAGES_DIR,"html", "tamplate.html");

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));
routes.use(cookieParser());

// ✅ 2) 그 다음에 정적 파일 (style.css 등)
routes.use("/css", express.static(PAGES_DIR));
routes.use("/js", express.static(PAGES_DIR));


function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "login.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});




routes.post("/", async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({
      success: false,
      message: "아이디 또는 비밀번호 누락"
    });
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

    // 🔥 bcrypt 비교
    const isMatch = await bcrypt.compare(password, userinfo.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "비밀번호가 일치하지 않습니다"
      });
    }

    // ======================
    // 🔥 세션 생성
    // ======================
    const sessionId = generateRandomString(32);
    const sessionDir = path.join(database, "session");

    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    // 🔥 세션 데이터 (만료 포함)
    const sessionData = {
      userId: userinfo.userId,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + (1000 * 60 * 60 * 24) // 24시간
    };

    fs.writeFileSync(
      path.join(sessionDir, `${sessionId}.json`),
      JSON.stringify(sessionData, null, 2)
    );

    // ======================
    // 🔥 쿠키 설정 (중요)
    // ======================
    res.cookie("sessionid", sessionId, {
      httpOnly: true,
      secure: true,              // HTTPS
      sameSite: "none",          // 🔥 변경 (strict → none)
      domain: ".softoasis.org",  // 🔥 추가 (핵심)
      maxAge: 1000 * 60 * 60 * 24,
      path: "/"
    });

    // ======================
    // 🔥 응답
    // ======================
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

/**
 * 템플릿 렌더링
 */
function renderTemplate(pagePath) {
    const templatePath = path.join(TEMPLATE_PATH);

    try {
        let template = fs.readFileSync(templatePath, "utf-8");
        const pageContent = fs.readFileSync(pagePath, "utf-8");

        return template.replace("<!-- MAIN_CONTENT -->", pageContent);
    } catch (err) {
        console.error("템플릿 렌더링 실패:", err);
        return null;
    }
}




module.exports = routes;