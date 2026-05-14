const express = require("express");
const path = require("path");
const fs = require("fs");

const routes = express.Router();
routes.use("/css", express.static(path.join(__dirname, "pages/css")));
routes.use("/js", express.static(path.join(__dirname, "pages/js")));
routes.use("/image", express.static(path.join(__dirname, "pages/image")));

// 🎲 주사위 함수
function rollDice(min = 1, max = 6) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



/**
 * 1️⃣ GET
 * → UI (HTML) 반환
 */
routes.get("/nomal", (req, res) => {

    const filePath = path.join(__dirname, "./pages/html/contant.html");

    let html = fs.readFileSync(filePath, "utf8");

    // 초기 화면은 결과 없음 or 0
    html = html.replace("{{result}}", "-");

    res.send(html);
});


/**
 * 2️⃣ POST
 * → 값(JSON) 반환
 */
routes.post("/nomal", (req, res) => {

    const dice = rollDice();

    res.json({
        success: true,
        result: dice
    });

});

module.exports = routes;