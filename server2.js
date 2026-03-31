// 도메인
// www.softoasis.org, m.softoasis.org, neo.softoasis.org ...

//업로드 git push -u origin main --force
//다운로드 git clone https://github.com/softoasis2022/softoasis.git

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
      host: req.headers.host,
      url: req.url
    };

    const safeLogid = logid.replace(/[^a-zA-Z0-9_-]/g, "");
    const ref_path = path.join(logdatabase, `${safeLogid}.jsonl`);

    fs.mkdirSync(path.dirname(ref_path), { recursive: true });
    fs.appendFileSync(ref_path, JSON.stringify(log) + "\n", "utf-8");
  }

  next();
});

// ======================
// 라우터 로드
// ======================
const softoasisApp = require("./app/softoasis/app");
const mobileApp = require("./app/mobile/app");
const recipeApp = require("./app/recipe/app");

const neoApp = require("./neo/app");
const worldApp = require("./app/world/app");

const contantApp = require("./neo/app");   // 기존 구조 유지

const sellerApp = require("./seller/app");
const adminApp = require("./admin/app");
const apiApp = require("./api/api");

const accountApp = require("./app/account/app");
const imageApp = require("./image/img");

// ======================
// 🔥 공통 라우트 (모든 도메인)
// ======================
app.use("/acount", accountApp);
app.use("/image", imageApp);

// ======================
// 🔥 호스트 기반 자동 라우팅 (핵심)
// ======================
app.use((req, res, next) => {
  const host = (req.headers.host || "").replace(/:\d+$/, "");
  console.log("🌐 Host:", host);

  // ======================
  // www.softoasis.org (기본 플랫폼)
  // ======================
  if (host === "www.softoasis.org" || host === "softoasis.org") {
    if (req.url.startsWith("/mobile")) return mobileApp(req, res, next);
    if (req.url.startsWith("/recipe")) return recipeApp(req, res, next);
    if (req.url.startsWith("/contant")) return contantApp(req, res, next);
    return softoasisApp(req, res, next);
  }

  // ======================
  // m.softoasis.org
  // ======================
  if (host === "m.softoasis.org") {
    return mobileApp(req, res, next);
  }

  // ======================
  // neo.softoasis.org
  // ======================
  if (host === "neo.softoasis.org") {
    if (req.url.startsWith("/world")) return worldApp(req, res, next);
    return neoApp(req, res, next);
  }

  // ======================
  // seller.softoasis.org
  // ======================
  if (host === "seller.softoasis.org") {
    return sellerApp(req, res, next);
  }

  // ======================
  // admin.softoasis.org
  // ======================
  if (host === "admin.softoasis.org") {
    return adminApp(req, res, next);
  }

  // ======================
  // api.softoasis.org
  // ======================
  if (host === "api.softoasis.org") {
    return apiApp(req, res, next);
  }

  res.status(404).send("Unknown Host");
});

// ======================
// 🔥 채팅 라우터
// ======================
const chat = require("./chat/app");
app.use("/chat", chat.routes);

// ======================
// HTTPS 서버 생성
// ======================
const certDir = path.join(__dirname, "certs");

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
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  console.log("🔥 socket.io 연결됨:", socket.id);
});

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