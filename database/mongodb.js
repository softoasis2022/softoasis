const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let database = null;

async function connectMongoDB() {
    // 이미 연결되어 있으면 기존 연결 재사용
    if (database) {
        return database;
    }

    await client.connect();

    await client.db("admin").command({
        ping: 1
    });

    // 사용할 데이터베이스 선택
    database = client.db("production");

    console.log("MongoDB 연결 성공");

    return database;
}

async function closeMongoDB() {
    await client.close();
    database = null;

    console.log("MongoDB 연결 종료");
}

module.exports = {
    connectMongoDB,
    closeMongoDB
};