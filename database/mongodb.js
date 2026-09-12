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

//로그인 에러
// 로그인 오류: Error: 데이터베이스 이름이 필요합니다.
//     at connectMongoDB (C:\Users\hang0\.vscode\project\softoasis\database\mongodb.js:15:15)
//     at C:\Users\hang0\.vscode\project\softoasis\app\account\login\app.js:57:33
//     at Layer.handleRequest (C:\Users\hang0\.vscode\project\softoasis\node_modules\router\lib\layer.js:152:17)
//     at next (C:\Users\hang0\.vscode\project\softoasis\node_modules\router\lib\route.js:157:13)
//     at Route.dispatch (C:\Users\hang0\.vscode\project\softoasis\node_modules\router\lib\route.js:117:3)
//     at handle (C:\Users\hang0\.vscode\project\softoasis\node_modules\router\index.js:435:11)
//     at Layer.handleRequest (C:\Users\hang0\.vscode\project\softoasis\node_modules\router\lib\layer.js:152:17)
//     at C:\Users\hang0\.vscode\project\softoasis\node_modules\router\index.js:295:15
//     at processParams (C:\Users\hang0\.vscode\project\softoasis\node_modules\router\index.js:582:12)
//     at next (C:\Users\hang0\.vscode\project\softoasis\node_modules\router\index.js:291:5)