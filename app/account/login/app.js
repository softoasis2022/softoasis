const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();
const cookieParser = require("cookie-parser");
routes.use(cookieParser());
const crypto = require("crypto");

// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const database = path.join("C:", "database");
const PAGES_DIR = path.join(ROOT, "pages");
const imgDB = path.join(database, "image");

// 정적 파일
routes.use(express.static(ROOT));
routes.use(express.static(imgDB));

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

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


routes.post("/", (req, res) => {
  const { userId, password } = req.body;
  console.log(userId, password);
  console.log("req.body:", req.body);

  if (!userId || !password) {
    return res.status(400).json({ message: "아이디 또는 비밀번호 누락" });
  }

  try {
    const userPath = path.join(database, "app", "user", `${userId}.json`);
    const userinfo = JSON.parse(fs.readFileSync(userPath, "utf8"));
    console.log(typeof (password), typeof (userinfo.password));
    if (password === userinfo.password) {
      // ✅ userinfo.usernumber 를 쿠키로 전달
      // ✅ 쿠키 이름은 userid
      const sessionId = generateRandomString(32);

      // 세션 저장
      fs.writeFileSync(
        path.join(database, "session", `${sessionId}.json`),
        JSON.stringify({
          userid: userinfo.usernumber
        })
      );

      // 쿠키에는 sessionid만
      res.cookie("sessionid", sessionId, {
        httpOnly: true,
        path: "/"
      });
      return res.status(200).json({
        success: true,
        message: "로그인 성공"
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "비밀번호가 일치하지 않습니다"
      });
    }
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "존재하지 않는 사용자"
    });
  }
});





module.exports = routes;