const express = require("express");
const path = require("path");
const multer = require("multer");
const routes = express.Router();

// 🔹 이미지 저장 경로 설정 (예: D드라이브 또는 현재 폴더 내)
const USER_IMAGE_ROOT = path.join(__dirname, "upload");  // 저장폴더 upload/

// -----------------------------
// 🔥 multer 저장 설정
// -----------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, USER_IMAGE_ROOT);  // 저장할 폴더
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);   // 파일 확장자
        const filename = Date.now() + "_" + Math.random().toString(36).substr(2, 9) + ext;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 용량 제한 10MB
});

// -----------------------------
// 🔥 업로드 API
// -----------------------------
routes.post("/upload", upload.single("img"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ result: false, msg: "이미지가 업로드되지 않음" });
        }

        return res.status(200).json({
            result: true,
            msg: "이미지 업로드 성공",
            filename: req.file.filename,
            url: "/profile/" + req.file.filename   // 클라이언트에서 바로 사용 가능 URL
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ result: false, msg: "서버 오류" });
    }
});

// -----------------------------
// 🔥 정적 파일 서비스
// -----------------------------
routes.use(express.static(USER_IMAGE_ROOT));
routes.use("/UI", express.static(path.join(__dirname, "UI")));
routes.use("/view", express.static(path.join(__dirname, "view")));
routes.use("/profile", express.static(USER_IMAGE_ROOT)); // 업로드된 이미지 제공

module.exports = routes;
