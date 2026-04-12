const express = require("express");
const fs = require("fs");
const path = require("path");
const routes = express.Router();

const chatDB = path.join("C:", "database", "chat");

//채팅은 서버에도 저장 메세지를 받은 클라이언트도 저장
//하단 채팅메뉴를 누루면 채팅부분이 나오며 채팅방리스트를 1번받고
//채팅방에 들어가면 해당 채팅내용을 한번더 다시 불러온다.
//채팅방의 메뉴는 웹뷰가 나오면서 내용은 채팅방 맴버, 채팅방 파트너스, 채팅방 노드(맴버들이 올려 놓은 링크들 로고링크,Url,제목,코멘트가 내용이다),채팅방이 가입한 컨텐츠

// 🔥 전역 상태
const users = {};
const rooms = {};

// 방정보 라우터
routes.use("/room", require("./routes/room"));

// ======================
// ✅ 채팅방 리스트
// ======================


<<<<<<< HEAD
  for (let roomId in rooms) {
    if (rooms[roomId].users.includes(userId)) {
      result.push({
        roomId,
        roomName: rooms[roomId].roomName,
        roomImage: rooms[roomId].roomImage,
        lastMessage: rooms[roomId].lastMessage,
        lastTime: rooms[roomId].lastTime
      });
    }
  }

  // 👉 최신 메시지 순 정렬
  result.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));

  res.json({
    success: true,
    rooms: result
  });
});

// ======================
// ✅ 메시지 조회
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
=======

>>>>>>> b43330d68af4bb348ee283a42364f76a0e353a7a

// ======================
// 🔥 채팅 초기화
// ======================
function initChat(io) {

  io.on("connection", (socket) => {
    console.log("🔥 채팅 연결:", socket.id);

    // ======================
    // 유저 연결
    // ======================
    socket.on("user:connect", (userId) => {
      users[userId] = socket.id;
      console.log("유저 연결:", userId);
    });

    // ======================
    // 방 생성 / 입장
    // ======================
    socket.on("room:create", ({ user1, user2 }) => {

      const roomId = [user1, user2].sort().join("_");

      const roomExists = !!rooms[roomId];

      // ✅ 방 없으면 생성
      if (!roomExists) {
        rooms[roomId] = {
          users: [user1, user2],
          lastMessage: "",
          lastTime: "",
          roomName: user2, // 임시
          roomImage: "/image/profile/default.png"
        };
      }

      // ✅ 방 참가 (항상 실행)
      rooms[roomId].users.forEach(userId => {
        const socketId = users[userId];
        if (socketId) {
          io.sockets.sockets.get(socketId)?.join(roomId);
        }
      });

      // ✅ 클라이언트 응답
      socket.emit("room:created", {
        roomId,
        isNew: !roomExists
      });
    });

    // ======================
    // 🔥 메시지 전송
    // ======================
    socket.on("chat:send", ({ roomId, message, from }) => {

      // ✅ 메시지 객체 먼저 생성 (🔥 중요 순서)
      const msg = {
        from,
        message,
        time: new Date().toISOString()
      };

      console.log("📩 room 메시지:", roomId, message);

      // 🔥 rooms 상태 업데이트
      if (rooms[roomId]) {
        rooms[roomId].lastMessage = message;
        rooms[roomId].lastTime = msg.time;
      }

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

      // 🔥 실시간 전송
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