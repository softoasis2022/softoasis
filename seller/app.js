const express = require("express");
const path = require("path");
const routes = express.Router();
const fs = require("fs");
const cookieParser = require("cookie-parser");
routes.use(cookieParser());

//routes.use(express.static(path.join(__dirname, "mobile", "pages", "login")));
const account = require("./routes/account/account");
const mobile = require("./routes/mobile/mobile");
const product = require("./routes/product/app");
const food = require("./routes/food/app");





// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const database = path.join("D:", "database");
const PAGES_DIR = path.join(ROOT,"routes","intro","page");
const imgDB= path.join(database, "image");

routes.use("/css", express.static(path.join(PAGES_DIR,"css")));
routes.use("/js", express.static(path.join(PAGES_DIR,"js")));

// 정적 파일
routes.use(express.static(ROOT));
routes.use(express.static(imgDB));

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));



//쿠키 확인
//로그인 안되어 있으면 로그인 페이지로 이동
routes.use("/account",account);
//쿠키에 admin.softoasis.org 쿠키에 sessionid가 없으면 /acount/login으로 리디렉션
// sessionid 쿠키가 없으면 로그인 페이지로 이동
routes.use((req, res, next) => {
    const { sellerSessionId } = req.cookies;

    if (!sellerSessionId) {
        return res.redirect("/account/login");
    }

    console.log(sellerSessionId);

    req.sellerSessionId = sellerSessionId;

    next();
});


routes.get("/", (req, res) => {
  //console.log("PAGES_DIR:", PAGES_DIR);
  //console.log("files:", fs.readdirSync(PAGES_DIR));
  return res.sendFile("index.html", { root: path.join(PAGES_DIR,"html") });
});

routes.use("/mobile",mobile);

routes.use("/product",product);
routes.use("/food",food);


module.exports = routes;