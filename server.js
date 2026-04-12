// 도메인
// www.softoasis.org, m.softoasis.org, neo.softoasis.org ...

//업로드 git push -u origin main --force
//다운로드 git clone https://github.com/softoasis2022/softoasis.git

//git add .
//git commit -m "add missed files"
//git push origin main


const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();

// ======================
// 기본 설정
// ======================
app.use("/.well-known/acme-challenge",
  express.static(path.join(__dirname, ".well-known/acme-challenge"))
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// 로그 시스템
// ======================
const database = path.join("C:", "database");
const logdatabase = path.join(database, "log", "requestpageurl");

app.use((req, res, next) => {
  const cookies = req.headers.cookie || "";
  const logidMatch = cookies.match(/logid=([^;]+)/);

  let logid;
  if (!logidMatch) {
    logid = uuidv4();
    res.cookie("logid", logid, { httpOnly: true });
    console.log("새 logid 발급:", logid);
  } else {
    logid = logidMatch[1];
  }

  const accept = req.headers.accept || "";
  const dest = req.headers["sec-fetch-dest"] || "";

  if (accept.includes("text/html") || dest === "document") {
    const log = {
      time: new Date().toISOString(),
      method: req.method,
      url: req.url
    };

    const safeLogid = logid.replace(/[^a-zA-Z0-9_-]/g, "");
    const ref_path = path.join(logdatabase, `${safeLogid}.jsonl`);

    fs.mkdirSync(path.dirname(ref_path), { recursive: true });
    fs.appendFileSync(ref_path, JSON.stringify(log) + "\n", "utf-8");
  }

  next();
});
// 🔥 neo 서브도메인 라우팅
app.use((req, res, next) => {
  const host = req.headers.host || "";

  if (host.startsWith("neo.")) {
    return require("./neo/app")(req, res, next);
  } 
  else if (host.startsWith("admin.")) {
    return require("./admin/app")(req, res, next);
  }
  else if (host.startsWith("seller.")) {
    return require("./seller/app")(req, res, next);
  }

  next(); // 🔥 이거 필수
});

// ======================
// 라우터
// ======================

//소프트오아시스 제공 소개 및 소프트오아시스의 자사 매인 컨텐츠 www.softoasis.org , 제공 제한 : 없음
app.use("/", require("./app/softoasis/app"));
app.use("/softoasis", require("./app/softoasis/app"));
app.use("/mobile", require("./app/mobile/app"));
app.use("/recipe", require("./app/recipe/app"));

app.use("/contant", require("./neo/app"));

//neo에서 사용하는 메인 컨텐츠 neo.softoasis.org, 제공 제한 : 없음 (로그인이 필요한 것들은 제한, 개별 로그인 사용)
app.use("/world", require("./app/world/app"));

//api 파트너스가 요청하는 데이터 공유 api.softoasis.org , 제공제한 : 등록된 파트너사 및 
app.use("/api", require("./api/api"));

//admin , seller , api 를 제와한 모든 곳에서 사용 가능 www.softoasis.org
app.use("/acount", require("./app/account/app"));
app.use("/image", require("./image/img"));

// ======================
// 🔥 채팅 라우터
// ======================
const chat = require("./chat/app");
app.use("/chat", chat.routes);

// ======================
// HTTPS 서버 생성
// ======================
const certDir = path.join("C:", "certs");

const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.join(certDir, "www.softoasis.org-key.pem")),
    cert: fs.readFileSync(path.join(certDir, "www.softoasis.org-crt.pem")),
    ca: fs.readFileSync(path.join(certDir, "www.softoasis.org-chain.pem")),
  },
  app
);

// ======================
// 🔥 socket.io 연결 (핵심)
// ======================
const io = new Server(httpsServer, {
  cors: {
    origin: "*",
  },
  transports: ["websocket"], // 🔥 강제 (안드로이드 안정화)
});

// 🔥 디버깅 로그
io.on("connection", (socket) => {
  console.log("🔥🔥🔥 socket.io 연결됨:", socket.id);
});

// 🔥 채팅 초기화
chat.initChat(io);

// ======================
// HTTP → HTTPS 리다이렉트
// ======================
http.createServer((req, res) => {
  const host = (req.headers.host || "").replace(/:\d+$/, "");
  console.log("host header:", req.headers.host);
  res.writeHead(301, {
    Location: `https://${host}${req.url}`,
  });
  res.end();
}).listen(80, () => {
  console.log("➡️ HTTP redirect server running (80 → 443)");
});

// ======================
// 서버 실행
// ======================
httpsServer.listen(443, () => {
  console.log("✅ HTTPS server running on https://www.softoasis.org");
});