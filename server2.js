// ======================
// HTTP / HTTPS 서버 설정
// ======================
const certDir = path.join("C:", "certs");

// 이번 인증서의 대표 도메인이 neo.softoasis.org이므로
// 발급 후 실제 파일명과 일치하는지 확인해야 함
const keyPath = path.join(certDir, "neo.softoasis.org-key.pem");
const certPath = path.join(certDir, "neo.softoasis.org-chain.pem");

// ======================
// HTTP 서버
// 인증서가 없어도 항상 실행되어야 함
// ======================
const httpServer = http.createServer(app);

httpServer.listen(80, "0.0.0.0", () => {
  console.log("✅ HTTP server running on port 80");
  console.log("✅ ACME validation path is available");
});

// ======================
// HTTPS 서버
// 인증서가 있을 때만 실행
// ======================
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    app
  );

  // ======================
  // Socket.IO 연결
  // ======================
  const io = new Server(httpsServer, {
    cors: {
      origin: "*",
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log("🔥🔥🔥 socket.io 연결됨:", socket.id);
  });

  chat.initChat(io);

  httpsServer.listen(443, "0.0.0.0", () => {
    console.log("✅ HTTPS server running on port 443");
  });
} else {
  console.log("⚠️ 인증서가 아직 없습니다.");
  console.log("⚠️ HTTPS 및 Socket.IO 서버는 실행하지 않습니다.");
  console.log("⚠️ 먼저 win-acme로 인증서를 발급하세요.");
}