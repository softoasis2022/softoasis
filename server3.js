const express = require("express");
const http = require("http");

const app = express();

app.get("/", (req, res) => {
    console.log("접속:", req.ip);

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Server Test</title>
        </head>
        <body>
            <h1>SoftOasis Server Test</h1>
            <p>서버 접속 성공!</p>
        </body>
        </html>
    `);
});

const server = http.createServer(app);

server.listen(80, "0.0.0.0", () => {
    console.log("================================");
    console.log("HTTP 테스트 서버 실행");
    console.log("PORT : 80");
    console.log("================================");
});
