const express = require("express"); 
const path = require("path"); 
const fs = require("fs");
const routes = express.Router();

const PAGES_DIR = path.join(__dirname,"./routes","world","pages");
const TEMPLATE_PATH = path.join(__dirname,"./routes","world","pages","html","tamplate.html");

routes.use("/css", express.static(path.join(PAGES_DIR,"css")));
routes.use("/js", express.static(path.join(PAGES_DIR,"js")));

const town = require("./routes/town/app");
const station = require("./routes/station/app");
const pass = require("./routes/pass/app");

routes.use("/town", town);
routes.use("/station", station);
routes.use("/pass", pass);


const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const database = path.join("C:", "database");
const SESSION_DIR = path.join(database, "session");
const NEO_COOKIE_DIR = path.join(database, "neo", "cookies");

// 폴더 없으면 생성
if (!fs.existsSync(NEO_COOKIE_DIR)) {
    fs.mkdirSync(NEO_COOKIE_DIR, { recursive: true });
}

module.exports = (req, res, next) => {
    const cookies = req.cookies;

    let neoid = cookies?.neoid;
    const sessionid = cookies?.sessionid;

    // 🔥 1. neoid 이미 있으면 통과
    if (neoid) {
        req.neoid = neoid;
        return next();
    }

    // 🔥 2. sessionid 없으면 로그인으로
    if (!sessionid) {
        return res.redirect("https://www.softoasis.org/acount/login");
    }

    // 🔥 3. session 확인
    const sessionPath = path.join(SESSION_DIR, `${sessionid}.json`);

    if (!fs.existsSync(sessionPath)) {
        return res.redirect("https://www.softoasis.org/acount/login");
    }

    // 🔥 4. session 데이터 읽기
    const sessionData = JSON.parse(fs.readFileSync(sessionPath, "utf-8"));

    const userId = sessionData.userId;

    if (!userId) {
        return res.redirect("https://www.softoasis.org/acount/login");
    }

    // 🔥 5. neoid 생성
    neoid = crypto.randomBytes(12).toString("hex");

    // 🔥 6. neoid 저장
    const neoData = {
        neoid,
        userId,
        createdAt: new Date().toISOString()
    };

    const neoPath = path.join(NEO_COOKIE_DIR, `${neoid}.json`);
    fs.writeFileSync(neoPath, JSON.stringify(neoData, null, 2));

    // 🔥 7. 쿠키 설정
    res.cookie("neoid", neoid, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });

    // 🔥 8. 요청에 추가
    req.neoid = neoid;

    next();
};

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "world.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

routes.get("/create", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "world.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
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
