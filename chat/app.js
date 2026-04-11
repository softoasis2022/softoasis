const express = require("express");
const fs = require("fs");
const path = require("path");
const routes = express.Router();

const chatDB = path.join("C:", "database", "chat");

// 🔥 전역 상태
const users = {};
const rooms = {};

routes.use("/room",require("./routes/room"));

// ======================
// ✅ 채팅방 리스트
// ======================
routes.get("/rooms", (req, res) => {
  const { userId } = req.query;

  const result = [];

  for (let roomId in rooms) {
    if (rooms[roomId].includes(userId)) {
      result.push({
        roomId,
        users: rooms[roomId]
      });
    }
  }

  res.json({
    success: true,
    rooms: result
  });
});

// ======================
// ✅ 메시지 조회 API (추가)
// ======================
routes.get("/messages", (req, res) => {
  const { roomId } = req.query;

  if (!roomId) {
    return res.json({ success: false, message: "roomId 필요" });
  }

  const filePath = path.join(chatDB, `${roomId}.json`);

  if (!fs.existsSync(filePath)) {
    return res.json({ success: true, messages: [] });
  }

  const messages = JSON.parse(fs.readFileSync(filePath, "utf8"));

  res.json({
    success: true,
    messages
  });
});

// ======================
// 🔥 채팅 초기화
// ======================
function initChat(io) {

  io.on("connection", (socket) => {
    console.log("🔥 채팅 연결:", socket.id);

    // ======================
    // 유저 등록
    // ======================
    socket.on("user:connect", (userId) => {
      users[userId] = socket.id;
      console.log("유저 연결:", userId);
    });

    // ======================
    // 방 생성
    // ======================
    socket.on("room:create", ({ user1, user2 }) => {
      const roomId = `${user1}_${user2}`;

      rooms[roomId] = [user1, user2];

      rooms[roomId].forEach(userId => {
        const socketId = users[userId];
        if (socketId) {
          io.sockets.sockets.get(socketId)?.join(roomId);
        }
      });

      socket.emit("room:created", roomId);
    });

    // ======================
    // 🔥 메시지 (수정됨)
    // ======================
    socket.on("chat:send", ({ roomId, message, from }) => {

      const msg = {
        from,
        message,
        time: new Date().toISOString()
      };

      console.log("📩 room 메시지:", roomId, message);

      // 🔥 폴더 생성
      fs.mkdirSync(chatDB, { recursive: true });

      const filePath = path.join(chatDB, `${roomId}.json`);

      let messages = [];

      if (fs.existsSync(filePath)) {
        try {
          messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
        } catch (e) {
          messages = [];
        }
      }

      // 🔥 메시지 추가
      messages.push(msg);

      // 🔥 저장
      fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

      // 🔥 전송
      io.to(roomId).emit("chat:receive", msg);
    });

    // ======================
    // 연결 종료
    // ======================
    socket.on("disconnect", () => {
      console.log("❌ 연결 끊김:", socket.id);

      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
}

// ======================
// export
// ======================
module.exports = {
  routes,
  initChat
};