const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// --------------------------------------------------
// 기본 경로
// main.js 가 insta 폴더 안에 있다고 가정
// --------------------------------------------------

const ROOT = __dirname;
const databaseRoot = path.join(ROOT, "database");
const bizRoot = path.join(databaseRoot, "biz");
const socialRoot = path.join(databaseRoot, "social");

// --------------------------------------------------
// 공통 유틸
// --------------------------------------------------

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function readJson(filePath, defaultValue = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            return defaultValue;
        }

        const raw = fs.readFileSync(filePath, "utf8");

        if (!raw.trim()) {
            return defaultValue;
        }

        return JSON.parse(raw);
    } catch (error) {
        console.error("[readJson error]", error.message);
        return defaultValue;
    }
}

function writeJson(filePath, data) {
    try {
        ensureDir(path.dirname(filePath));
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
        return true;
    } catch (error) {
        console.error("[writeJson error]", error.message);
        return false;
    }
}

function cleanInstagramUrl(url) {
    try {
        const u = new URL(url);
        let pathname = u.pathname;

        if (!pathname.endsWith("/")) {
            pathname += "/";
        }

        return u.origin + pathname;
    } catch (error) {
        return null;
    }
}

function cleanCommonUrl(url) {
    try {
        const u = new URL(url);
        return u.origin + u.pathname;
    } catch (error) {
        return null;
    }
}

function cleanSocialUrl(type, url) {
    if (type === "insta") {
        return cleanInstagramUrl(url);
    }

    return cleanCommonUrl(url);
}

function extractInstagramName(url) {
    try {
        const cleanUrl = cleanInstagramUrl(url);
        if (!cleanUrl) return null;

        const u = new URL(cleanUrl);
        const parts = u.pathname.split("/").filter(Boolean);

        if (parts.length === 0) {
            return null;
        }

        return parts[0];
    } catch (error) {
        return null;
    }
}

// --------------------------------------------------
// 파일 경로 유틸
// --------------------------------------------------

function getBizFilePath(roomnumber) {
    return path.join(bizRoot, `${roomnumber}.json`);
}

function getUserSocialFilePath(roomnumber, usernumber) {
    console.log(path.join(socialRoot, roomnumber, `${usernumber}.json`));
    return path.join(socialRoot, roomnumber, `${usernumber}.json`);
}

// --------------------------------------------------
// 비즈 프로필 CRUD 함수
// --------------------------------------------------

function C_instabizprofile(roomnumber, name, url) {
    if (!roomnumber || !name || !url) {
        return {
            success: false,
            message: "roomnumber, name, url 은 필수입니다."
        };
    }

    const cleanUrl = cleanInstagramUrl(url);

    if (!cleanUrl) {
        return {
            success: false,
            message: "올바른 인스타그램 URL이 아닙니다."
        };
    }

    const filePath = getBizFilePath(roomnumber);
    const data = readJson(filePath, { insta: [] });

    if (!Array.isArray(data.insta)) {
        data.insta = [];
    }

    const exists = data.insta.find(item => item.url === cleanUrl);

    if (exists) {
        return {
            success: true,
            message: "이미 등록된 비즈 인스타 프로필입니다.",
            data: exists
        };
    }

    const newProfile = {
        name,
        url: cleanUrl
    };

    data.insta.push(newProfile);

    const ok = writeJson(filePath, data);

    if (!ok) {
        return {
            success: false,
            message: "비즈 인스타 프로필 저장 실패"
        };
    }

    return {
        success: true,
        message: "비즈 인스타 프로필 등록 완료",
        data: newProfile
    };
}

function R_instabizprofile(roomnumber) {
    if (!roomnumber) {
        return {
            success: false,
            message: "roomnumber가 필요합니다."
        };
    }

    const filePath = getBizFilePath(roomnumber);
    const data = readJson(filePath, { insta: [] });

    return {
        success: true,
        message: "채팅방 비즈 인스타 조회 완료",
        roomnumber,
        data
    };
}

function U_instabizprofile(roomnumber, oldUrl, newName, newUrl) {
    if (!roomnumber || !oldUrl || !newName || !newUrl) {
        return {
            success: false,
            message: "roomnumber, oldUrl, newName, newUrl 은 필수입니다."
        };
    }

    const filePath = getBizFilePath(roomnumber);
    const data = readJson(filePath, { insta: [] });

    if (!Array.isArray(data.insta)) {
        data.insta = [];
    }

    const oldCleanUrl = cleanInstagramUrl(oldUrl);
    const newCleanUrl = cleanInstagramUrl(newUrl);

    if (!oldCleanUrl || !newCleanUrl) {
        return {
            success: false,
            message: "올바른 인스타그램 URL이 아닙니다."
        };
    }

    const target = data.insta.find(item => item.url === oldCleanUrl);

    if (!target) {
        return {
            success: false,
            message: "수정할 비즈 인스타 프로필이 없습니다."
        };
    }

    target.name = newName;
    target.url = newCleanUrl;

    const ok = writeJson(filePath, data);

    if (!ok) {
        return {
            success: false,
            message: "비즈 인스타 프로필 수정 실패"
        };
    }

    return {
        success: true,
        message: "비즈 인스타 프로필 수정 완료",
        data: target
    };
}

function D_instabizprofile(roomnumber, url) {
    if (!roomnumber || !url) {
        return {
            success: false,
            message: "roomnumber, url 은 필수입니다."
        };
    }

    const filePath = getBizFilePath(roomnumber);
    const data = readJson(filePath, { insta: [] });

    if (!Array.isArray(data.insta)) {
        data.insta = [];
    }

    const cleanUrl = cleanInstagramUrl(url);

    if (!cleanUrl) {
        return {
            success: false,
            message: "올바른 인스타그램 URL이 아닙니다."
        };
    }

    const beforeLength = data.insta.length;

    data.insta = data.insta.filter(item => item.url !== cleanUrl);

    if (beforeLength === data.insta.length) {
        return {
            success: false,
            message: "삭제할 비즈 인스타 프로필이 없습니다."
        };
    }

    const ok = writeJson(filePath, data);

    if (!ok) {
        return {
            success: false,
            message: "비즈 인스타 프로필 삭제 실패"
        };
    }

    return {
        success: true,
        message: "비즈 인스타 프로필 삭제 완료"
    };
}

// --------------------------------------------------
// 유저 소셜 CRUD 함수
// --------------------------------------------------

function C_instauserprofile(usernumber, roomnumber, socialType, name, url) {
    if (!usernumber || !roomnumber || !socialType || !name || !url) {
        return {
            success: false,
            message: "usernumber, roomnumber, socialType, name, url 은 필수입니다."
        };
    }

    const cleanUrl = cleanSocialUrl(socialType, url);

    if (!cleanUrl) {
        return {
            success: false,
            message: "올바른 소셜 URL이 아닙니다."
        };
    }

    const filePath = getUserSocialFilePath(roomnumber, usernumber);
    const data = readJson(filePath, { social: {} });

    if (!data.social || typeof data.social !== "object") {
        data.social = {};
    }

    if (!Array.isArray(data.social[socialType])) {
        data.social[socialType] = [];
    }

    const exists = data.social[socialType].find(item => item.url === cleanUrl);

    if (exists) {
        return {
            success: true,
            message: "이미 등록된 유저 소셜 프로필입니다.",
            data: exists
        };
    }

    const newProfile = {
        name,
        url: cleanUrl
    };

    data.social[socialType].push(newProfile);

    const ok = writeJson(filePath, data);

    if (!ok) {
        return {
            success: false,
            message: "유저 소셜 프로필 저장 실패"
        };
    }

    return {
        success: true,
        message: "유저 소셜 프로필 등록 완료",
        data: newProfile
    };
}

function R_instauserprofile(usernumber, roomnumber) {
    if (!usernumber || !roomnumber) {
        return {
            success: false,
            message: "usernumber, roomnumber가 필요합니다."
        };
    }

    const filePath = getUserSocialFilePath(roomnumber, usernumber);
    const data = readJson(filePath, { social: {} });

    return {
        success: true,
        message: "유저 소셜 조회 완료",
        usernumber,
        roomnumber,
        data
    };
}

function U_instauserprofile(usernumber, roomnumber, socialType, oldUrl, newName, newUrl) {
    if (!usernumber || !roomnumber || !socialType || !oldUrl || !newName || !newUrl) {
        return {
            success: false,
            message: "필수값이 부족합니다."
        };
    }

    const filePath = getUserSocialFilePath(roomnumber, usernumber);
    const data = readJson(filePath, { social: {} });

    if (!data.social || typeof data.social !== "object") {
        data.social = {};
    }

    if (!Array.isArray(data.social[socialType])) {
        return {
            success: false,
            message: "해당 소셜 타입 데이터가 없습니다."
        };
    }

    const oldCleanUrl = cleanSocialUrl(socialType, oldUrl);
    const newCleanUrl = cleanSocialUrl(socialType, newUrl);

    if (!oldCleanUrl || !newCleanUrl) {
        return {
            success: false,
            message: "올바른 소셜 URL이 아닙니다."
        };
    }

    const target = data.social[socialType].find(item => item.url === oldCleanUrl);

    if (!target) {
        return {
            success: false,
            message: "수정할 유저 소셜 프로필이 없습니다."
        };
    }

    target.name = newName;
    target.url = newCleanUrl;

    const ok = writeJson(filePath, data);

    if (!ok) {
        return {
            success: false,
            message: "유저 소셜 프로필 수정 실패"
        };
    }

    return {
        success: true,
        message: "유저 소셜 프로필 수정 완료",
        data: target
    };
}

function D_instauserprofile(usernumber, roomnumber, socialType, url) {
    if (!usernumber || !roomnumber || !socialType || !url) {
        return {
            success: false,
            message: "필수값이 부족합니다."
        };
    }

    const filePath = getUserSocialFilePath(roomnumber, usernumber);
    const data = readJson(filePath, { social: {} });

    if (!data.social || typeof data.social !== "object") {
        data.social = {};
    }

    if (!Array.isArray(data.social[socialType])) {
        return {
            success: false,
            message: "해당 소셜 타입 데이터가 없습니다."
        };
    }

    const cleanUrl = cleanSocialUrl(socialType, url);

    if (!cleanUrl) {
        return {
            success: false,
            message: "올바른 소셜 URL이 아닙니다."
        };
    }

    const beforeLength = data.social[socialType].length;

    data.social[socialType] = data.social[socialType].filter(item => item.url !== cleanUrl);

    if (beforeLength === data.social[socialType].length) {
        return {
            success: false,
            message: "삭제할 유저 소셜 프로필이 없습니다."
        };
    }

    const ok = writeJson(filePath, data);

    if (!ok) {
        return {
            success: false,
            message: "유저 소셜 프로필 삭제 실패"
        };
    }

    return {
        success: true,
        message: "유저 소셜 프로필 삭제 완료"
    };
}

function C_instauserprofile_auto(usernumber, roomnumber, url) {
    const instagramName = extractInstagramName(url);

    if (!instagramName) {
        return {
            success: false,
            message: "인스타그램 계정명을 URL에서 추출할 수 없습니다."
        };
    }

    return C_instauserprofile(usernumber, roomnumber, "insta", instagramName, url);
}

function R_roomuserlist(roomnumber) {
    if (!roomnumber) {
        return {
            success: false,
            message: "roomnumber가 필요합니다."
        };
    }

    const roomDir = path.join(socialRoot, roomnumber);

    if (!fs.existsSync(roomDir)) {
        return {
            success: true,
            message: "해당 방의 유저 소셜 데이터가 없습니다.",
            roomnumber,
            users: []
        };
    }

    const files = fs.readdirSync(roomDir).filter(file => file.endsWith(".json"));

    const users = files.map(file => {
        const usernumber = path.basename(file, ".json");
        const filePath = path.join(roomDir, file);
        const data = readJson(filePath, { social: {} });

        return {
            usernumber,
            data
        };
    });

    return {
        success: true,
        message: "채팅방 유저 소셜 목록 조회 완료",
        roomnumber,
        users
    };
}

// --------------------------------------------------
// 라우트
// base : /insta
// --------------------------------------------------

// 채팅방 비즈 인스타 등록
router.post("/biz", (req, res) => {
    const { roomnumber, name, url } = req.body;
    const result = C_instabizprofile(roomnumber, name, url);
    res.json(result);
});

// 채팅방 비즈 인스타 조회
router.get("/biz/:roomnumber", (req, res) => {
    const { roomnumber } = req.params;
    const result = R_instabizprofile(roomnumber);
    res.json(result);
});

// 채팅방 비즈 인스타 수정
router.patch("/biz", (req, res) => {
    const { roomnumber, oldUrl, newName, newUrl } = req.body;
    const result = U_instabizprofile(roomnumber, oldUrl, newName, newUrl);
    res.json(result);
});

// 채팅방 비즈 인스타 삭제
router.delete("/biz", (req, res) => {
    const { roomnumber, url } = req.body;
    const result = D_instabizprofile(roomnumber, url);
    res.json(result);
});

// 유저 소셜 등록
router.post("/user", (req, res) => {
    const { usernumber, roomnumber, socialType, name, url } = req.body;
    const result = C_instauserprofile(usernumber, roomnumber, socialType, name, url);
    res.json(result);
});

// 유저 인스타 자동 등록
router.post("/user/insta/auto", (req, res) => {
    const { usernumber, roomnumber, url } = req.body;
    const result = C_instauserprofile_auto(usernumber, roomnumber, url);
    res.json(result);
});

// 유저 소셜 조회
router.get("/user", (req, res) => {
    const { roomnumber, usernumber } = req.query;
    const result = R_instauserprofile(usernumber, roomnumber);
    res.json(result);
});

// 유저 소셜 수정
router.patch("/user", (req, res) => {
    const { usernumber, roomnumber, socialType, oldUrl, newName, newUrl } = req.body;
    const result = U_instauserprofile(usernumber, roomnumber, socialType, oldUrl, newName, newUrl);
    res.json(result);
});

// 유저 소셜 삭제
router.delete("/user", (req, res) => {
    const { usernumber, roomnumber, socialType, url } = req.body;
    const result = D_instauserprofile(usernumber, roomnumber, socialType, url);
    res.json(result);
});

// 해당 방의 유저 소셜 목록 조회
router.get("/room/:roomnumber/users", (req, res) => {
    const { roomnumber } = req.params;
    const result = R_roomuserlist(roomnumber);
    res.json(result);
});

module.exports = router;
