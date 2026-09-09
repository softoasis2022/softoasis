const { MongoClient } = require("mongodb");

const mongoUrl =
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017";

const client = new MongoClient(mongoUrl);

let connectionPromise = null;


// 데이터베이스 연결
async function connectMongoDB(databaseName) {
    if (!databaseName) {
        throw new Error("데이터베이스 이름이 필요합니다.");
    }

    if (!connectionPromise) {
        connectionPromise = client.connect()
            .then(() => {
                console.log("MongoDB 연결 성공");
                return client;
            })
            .catch(error => {
                connectionPromise = null;
                throw error;
            });
    }

    const connectedClient = await connectionPromise;

    return connectedClient.db(databaseName);
}


// 서버 종료 시 연결 종료
async function closeMongoDB() {
    if (!connectionPromise) {
        return;
    }

    await client.close();
    connectionPromise = null;

    console.log("MongoDB 연결 종료");
}


module.exports = {
    connectMongoDB,
    closeMongoDB
};