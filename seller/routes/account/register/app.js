const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();
const { v4: uuidv4 } = require('uuid');

// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const database = path.join("D:", "database");
const PAGES_DIR = path.join(ROOT, "pages");
const imgDB = path.join(database, "image");

// 정적 파일
routes.use(express.static(ROOT));
routes.use(express.static(imgDB));

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

// ✅ 1) "/"는 라우트가 먼저 처리 (login.html을 직접 내려줌)
routes.get("/", (req, res) => {
    //console.log("PAGES_DIR:", PAGES_DIR);
    //console.log("files:", fs.readdirSync(PAGES_DIR));
    return res.sendFile("index.html", { root: PAGES_DIR });
});

// ✅ 2) 그 다음에 정적 파일 (style.css 등)
routes.use("/", express.static(PAGES_DIR));

routes.post("/idcheck", (req, res) => {
    const { userId } = req.body;

    // 1️⃣ 값 검증
    if (!userId) {
        return res.status(400).json({
            available: false,
            message: "아이디가 전달되지 않았습니다."
        });
    }

    // 2️⃣ 파일 경로 생성
    const userFilePath = path.join(
        database,
        "seller",
        "user",
        `${userId}.json`
    );

    // 3️⃣ 파일 존재 여부 확인
    if (fs.existsSync(userFilePath)) {
        // 이미 존재 → 중복
        return res.json({
            available: false,
            message: "이미 사용 중인 아이디입니다."
        });
    }

    // 4️⃣ 존재하지 않음 → 사용 가능
    return res.json({
        available: true,
        message: "사용 가능한 아이디입니다."
    });
});

routes.post("/", (req, res) => {
    console.log(req.body);
    const { userId, password,passwordConfirm, name, phone, email } = req.body;

    if(password === passwordConfirm) {
        
    }
    else{
        res.json({
            message : ""
        });
    }

    //랜덤
    let sellerid;
    if (sellerid) {
        sellerid = uuidv4();
        res.cookie("logid", sellerid, { httpOnly: true });
        console.log("새 logid 발급:", sellerid);
    } else {
        sellerid = logidMatch[1];
    }

    

    res.status(200).json({
        message: "성공"
    })
});

// routes.post("/", (req, res) => {
//   const { userId, password } = req.body;

//   if (!userId || !password) {
//     return res.status(400).json({ message: "아이디 또는 비밀번호 누락" });
//   }

//   try {
//     const userPath = path.join(database,"seller", "user", `${userId}.json`);
//     const userinfo = JSON.parse(fs.readFileSync(userPath, "utf8"));

//     if (password === userinfo.password) {
//       // ✅ userinfo.usernumber 를 쿠키로 전달
//       // ✅ 쿠키 이름은 userid
//       res.cookie("sellerid", userinfo.usernumber, {
//         httpOnly: true,          // JS 접근 차단 (보안)
//         secure: true,            // HTTPS에서만 전송 (softoasis는 https)
//         sameSite: "lax",         // 기본 로그인 세션에 적합
//         maxAge: 1000 * 60 * 60 * 24 // 1일
//       });

//       return res.status(200).json({
//         success: true,
//         message: "로그인 성공"
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "비밀번호가 일치하지 않습니다"
//       });
//     }
//   } catch (err) {
//     return res.status(404).json({
//       success: false,
//       message: "존재하지 않는 사용자"
//     });
//   }
// });




module.exports = routes;