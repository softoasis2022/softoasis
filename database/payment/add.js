const {
    connectMongoDB,
    closeMongoDB
} = require("../mongodb");

async function add(price) {
    try {
        const database = await connectMongoDB();
        const users = database.collection("payment");

        await users.createIndex(
            { userId: 1 },
            { unique: true }
        );

        await users.createIndex(
            { phone: 1 },
            { unique: true }
        );

        // 매개변수와 다른 이름 사용
        const normalizedUserId = String(userId || "").trim();

        const normalizedPhone = String(phone || "")
            .replace(/\D/g, "");

        // 아이디 검사
        if (!/^[a-zA-Z0-9_]{4,20}$/.test(normalizedUserId)) {
            throw new Error(
                "아이디는 영문, 숫자, 밑줄을 사용해 4~20자로 입력해주세요."
            );
        }

        // 전화번호 검사
        if (!/^01[016789]\d{7,8}$/.test(normalizedPhone)) {
            throw new Error(
                "올바른 휴대전화 번호를 입력해주세요."
            );
        }

        const newUser = {
            userId: normalizedUserId,
            price : price,
            nickname: "테스트유저",
            phoneVerified: false,
            accountStatus: "active",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await users.insertOne(newUser);

        console.log("유저 추가 성공");
        console.log("MongoDB ID:", result.insertedId);
        console.log("로그인 아이디:", normalizedUserId);

        return result;

    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern?.userId) {
                console.error("이미 사용 중인 아이디입니다.");
            } else if (error.keyPattern?.phone) {
                console.error("이미 등록된 전화번호입니다.");
            }
        } else {
            console.error("유저 추가 실패:", error.message);
        }
    } finally {
        await closeMongoDB();
    }
}

// 반드시 아이디와 전화번호 전달
module.exports = {
    addUser
};