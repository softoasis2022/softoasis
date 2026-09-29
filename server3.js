// 도메인
// www.softoasis.org, m.softoasis.org, neo.softoasis.org ...

const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const app = express();

// ======================
// 기본 설정
// ======================

// Let's Encrypt 인증용 경로
// 나중에 인증서 발급할 때 그대로 사용할 수 있으므로 유지
app.use(
    "/.well-known/acme-challenge",
    express.static(path.join(__dirname, ".well-known", "acme-challenge"))
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// 로그 시스템
// ======================

const database = path.join("C:", "database");
const logdatabase = path.join(
    database,
    "log",
    "requestpageurl"
);

app.use((req, res, next) => {

    const cookies = req.headers.cookie || "";
    const logidMatch = cookies.match(/logid=([^;]+)/);

    let logid;

    if (!logidMatch) {

        logid = uuidv4();

        res.cookie("logid", logid, {
            httpOnly: true
        });

        console.log("새 logid 발급:", logid);

    } else {

        logid = logidMatch[1];

    }

    const accept = req.headers.accept || "";
    const dest = req.headers["sec-fetch-dest"] || "";

    if (
        accept.includes("text/html") ||
        dest === "document"
    ) {

        const log = {
            time: new Date().toISOString(),
            method: req.method,
            url: req.url
        };

        const safeLogid = logid.replace(
            /[^a-zA-Z0-9_-]/g,
            ""
        );

        const ref_path = path.join(
            logdatabase,
            `${safeLogid}.jsonl`
        );

        fs.mkdirSync(
            path.dirname(ref_path),
            {
                recursive: true
            }
        );

        fs.appendFileSync(
            ref_path,
            JSON.stringify(log) + "\n",
            "utf-8"
        );
    }

    next();
});


// ======================
// 서브도메인 라우팅
// ======================

app.use((req, res, next) => {

    // :80 같은 포트 번호 제거
    const host = (req.headers.host || "")
        .split(":")[0]
        .toLowerCase();

    if (host === "neo.softoasis.org") {

        return require("./neo/app")(
            req,
            res,
            next
        );

    }

    if (host === "admin.softoasis.org") {

        return require("./admin/app")(
            req,
            res,
            next
        );

    }

    if (host === "seller.softoasis.org") {

        return require("./seller/app")(
            req,
            res,
            next
        );

    }

    next();
});


// ======================
// 일반 라우터
// ======================

// SoftOasis
app.use(
    "/",
    require("./app/softoasis/app")
);

app.use(
    "/softoasis",
    require("./app/softoasis/app")
);

app.use(
    "/mobile",
    require("./app/mobile/app")
);

app.use(
    "/shop",
    require("./app/shop/app")
);

app.use(
    "/event",
    require("./app/event/app")
);

app.use(
    "/contantflow",
    require("./contentflow/app")
);

app.use(
    "/tc",
    require("./app/TC/app")
);

app.use(
    "/teamSYNERGY",
    require("./app/teamSYNERGY/app")
);

app.use(
    "/contentflow",
    require("./contentflow/app")
);


// ======================
// API
// ======================

app.use(
    "/api",
    require("./api/api")
);


// ======================
// 계정 / 이미지
// ======================

app.use(
    "/acount",
    require("./app/account/app")
);

app.use(
    "/image",
    require("./image/img")
);


// ======================
// 채팅
// ======================

const chat = require("./neo/routes/chat/app");

app.use(
    "/chat",
    chat.routes
);


// ======================
// HTTP 서버
// ======================

// Express를 HTTP 서버에 연결
const httpServer = http.createServer(app);


// ======================
// Socket.IO
// ======================

const io = new Server(httpServer, {

    cors: {
        origin: "*"
    },

    transports: [
        "websocket"
    ]
});


// Socket.IO 테스트 로그
io.on("connection", (socket) => {

    console.log(
        "🔥 Socket.IO 연결됨:",
        socket.id
    );

});


// 채팅 Socket.IO 연결
chat.initChat(io);


// ======================
// 서버 실행
// ======================

const PORT = 80;

httpServer.listen(PORT, "0.0.0.0", () => {

    console.log(
        `✅ HTTP Server running on port ${PORT}`
    );

    console.log(
        `🌐 http://www.softoasis.org`
    );

});