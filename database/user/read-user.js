// 데이터베이스에서 유저 정보 찾기

const {
    connectMongoDB
} = require("../mongodb");

async function findUser_id(data) {
    try {
        const normalizedId = String(id || "").trim();

        if (!normalizedId) {
            throw new Error("로그인 아이디가 필요합니다.");
        }

        const database = await connectMongoDB("user");
        const users = database.collection("users");

        const user = await users.findOne({
            userId: normalizedId
        });

        return user;
    } catch (error) {
        console.error("유저 정보 조회 실패:", error);
        throw error;
    }
}
async function findUser_phone(data) {
    try {
        const normalizedId = String(data || "").trim();

        if (!normalizedId) {
            throw new Error("로그인 아이디가 필요합니다.");
        }

        const database = await connectMongoDB("user");
        const users = database.collection("users");

        const user = await users.findOne({
            phone: data
        });

        return user;
    } catch (error) {
        console.error("유저 정보 조회 실패:", error);
        throw error;
    }
}
async function findUser_contantid(data) {
    try {
        const normalizedId = String(data || "").trim();

        if (!normalizedId) {
            throw new Error("로그인 아이디가 필요합니다.");
        }

        const database = await connectMongoDB("user");
        const users = database.collection("users");

        const user = await users.findOne({
            contantid: data
        });

        return user;
    } catch (error) {
        console.error("유저 정보 조회 실패:", error);
        throw error;
    }
}
async function findUser_admin(data) {

    //모든 users 컬랙션에 있는 계정 모두 응답
    try {
        const normalizedId = String(data || "").trim();

        if (!normalizedId) {
            throw new Error("로그인 아이디가 필요합니다.");
        }

        const database = await connectMongoDB("user");
        const users = database.collection("users");

        const user = await users.findOne({
            contantid: data
        });

        return user;
    } catch (error) {
        console.error("유저 정보 조회 실패:", error);
        throw error;
    }
}

async function filter(filter, data) {

    if (filter == "phone") {
        try {
            const user = await findUser_phone(data);

            if (!user) {
                console.log("일치하는 유저가 없습니다.");
                return;
            }

            console.log("조회된 유저:", user);
        } catch (error) {
            console.error("테스트 실패:", error);
        }
    }
    else if (filter == "contantid") {
        try {
            const user = await findUser_contantid(data);

            if (!user) {
                console.log("일치하는 유저가 없습니다.");
                return;
            }

            console.log("조회된 유저:", user);
        } catch (error) {
            console.error("테스트 실패:", error);
        }
    }
    else if (filter == "admin") {
        try {
            const user = await findUser_contantid(data);

            if (!user) {
                console.log("일치하는 유저가 없습니다.");
                return;
            }

            console.log("조회된 유저:", user);
        } catch (error) {
            console.error("테스트 실패:", error);
        }
    }
    else {
        try {
            const user = await findUser_id("hang05312");

            if (!user) {
                console.log("일치하는 유저가 없습니다.");
                return;
            }

            console.log("조회된 유저:", user);
        } catch (error) {
            console.error("테스트 실패:", error);
        }
    }

}
async function finduser(readtype, filtertype, data) {

    if (readtype == "signup") {
        const userinfo = await filter(filtertype, data);
        if(userinfo){
            return true
        }
        else{
            return false
        }
    }
    if (readtype == "admin") {
        const userinfo = await filter(filtertype, data);
        return userinfo
    }
    else{
        const userinfo = await filter(filtertype, data);
        return userinfo
    }
}

finduser("none","contantid", "0001");

module.exports = {
    finduser
};