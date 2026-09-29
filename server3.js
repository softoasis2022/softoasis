// 도메인
// www.softoasis.org, m.softoasis.org, neo.softoasis.org ...

// 업로드
// git push -u origin main --force

// 다운로드
// git clone https://github.com/softoasis2022/softoasis.git

// git add .
// git commit -m "add missed files"
// git push origin main


const fs = require("fs");
const path = require("path");

// ========================================
// HTTPS 사용 시 다시 활성화
// ========================================
// const https = require("https");

const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();


const app = express();


// ======================
// 기본 설정
// ======================

// Let's Encrypt HTTP-01 인증 경로
// 나중에 인증서 발급할 때 필요하므로 유지
app.use(
  "/.well-known/acme-challenge",
  express.static(
    path.join(__dirname, ".well-known", "acme-challenge")
  )
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


// ======================
// 로그 시스템
// ======================

const database = path.join(
  "C:",
  "database"
);

const logdatabase = path.join(
  database,
  "log",
  "requestpageurl"
);


app.use((req, res, next) => {

  const cookies = req.headers.cookie || "";

  const logidMatch = cookies.match(
    /logid=([^;]+)/
  );


  let logid;


  if (!logidMatch) {

    logid = uuidv4();

    res.cookie(
      "logid",
      logid,
      {
        httpOnly: true
      }
    );

    console.log(
      "새 logid 발급:",
      logid
    );

  } else {

    logid = logidMatch[1];

  }


  const accept =
    req.headers.accept || "";

  const dest =
    req.headers["sec-fetch-dest"] || "";


  if (
    accept.includes("text/html") ||
    dest === "document"
  ) {

    const log = {

      time: new Date().toISOString(),

      method: req.method,

      url: req.url

    };


    const safeLogid =
      logid.replace(
        /[^a-zA-Z0-9_-]/g,
        ""
      );


    const ref_path =
      path.join(
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

  // localhost:80
  // neo.softoasis.org:80
  // 같은 경우 포트 제거
  const host = (
    req.headers.host || ""
  )
    .split(":")[0]
    .toLowerCase();


  if (host === "neo.softoasis.org") {

    return require("./neo/app")(
      req,
      res,
      next
    );

  }


  else if (
    host === "admin.softoasis.org"
  ) {

    return require("./admin/app")(
      req,
      res,
      next
    );

  }


  else if (
    host === "seller.softoasis.org"
  ) {

    return require("./seller/app")(
      req,
      res,
      next
    );

  }


  next();

});


// ======================
// 라우터
// ======================

// 소프트오아시스 메인

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

const chat =
  require("./neo/routes/chat/app");

app.use(
  "/chat",
  chat.routes
);


// ======================================================
// HTTPS 서버 생성
// 현재 인증서 문제로 임시 비활성화
// 인증서 발급 완료 후 다시 활성화
// ======================================================

/*

const certDir = path.join(
  "C:",
  "certs"
);


const httpsServer =
  https.createServer(
    {

      key: fs.readFileSync(
        path.join(
          certDir,
          "www.softoasis.org-key.pem"
        )
      ),

      cert: fs.readFileSync(
        path.join(
          certDir,
          "www.softoasis.org-crt.pem"
        )
      ),

      ca: fs.readFileSync(
        path.join(
          certDir,
          "www.softoasis.org-chain.pem"
        )
      )

    },

    app
  );

*/


// ======================================================
// HTTP 서버 생성
// 현재 이 서버를 사용
// ======================================================

const httpServer =
  http.createServer(app);


// ======================
// Socket.IO
// ======================

// 기존 HTTPS
//
// const io = new Server(httpsServer, {
//   cors: {
//     origin: "*",
//   },
//   transports: ["websocket"],
// });


// 현재 HTTP 서버에 Socket.IO 연결

const io = new Server(
  httpServer,
  {

    cors: {
      origin: "*"
    },

    transports: [
      "websocket"
    ]

  }
);


// ======================
// Socket.IO 연결 로그
// ======================

io.on(
  "connection",
  (socket) => {

    console.log(
      "🔥🔥🔥 Socket.IO 연결됨:",
      socket.id
    );

  }
);


// ======================
// 채팅 초기화
// ======================

chat.initChat(io);


// ======================================================
// 기존 HTTP → HTTPS 리다이렉트
// 현재 비활성화
// ======================================================

/*

http.createServer(
  (req, res) => {

    const host =
      (req.headers.host || "")
        .replace(
          /:\d+$/,
          ""
        );


    console.log(
      "host header:",
      req.headers.host
    );


    res.writeHead(
      301,
      {
        Location:
          `https://${host}${req.url}`
      }
    );


    res.end();

  }
).listen(
  80,
  () => {

    console.log(
      "➡️ HTTP redirect server running (80 → 443)"
    );

  }
);

*/


// ======================================================
// 기존 HTTPS 443 서버
// 현재 비활성화
// ======================================================

/*

httpsServer.listen(
  443,
  () => {

    console.log(
      "✅ HTTPS server running on https://www.softoasis.org"
    );

  }
);

*/


// ======================================================
// 현재 HTTP 80 서버 실행
// ======================================================

const PORT = 80;


httpServer.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      "======================================"
    );

    console.log(
      "✅ SoftOasis HTTP Server 실행"
    );

    console.log(
      `🌐 PORT : ${PORT}`
    );

    console.log(
      "🌐 http://www.softoasis.org"
    );

    console.log(
      "🌐 http://neo.softoasis.org"
    );

    console.log(
      "🌐 http://admin.softoasis.org"
    );

    console.log(
      "🌐 http://seller.softoasis.org"
    );

    console.log(
      "======================================"
    );

  }
);
