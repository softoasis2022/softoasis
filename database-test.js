const {
    connectMongoDB,
    closeMongoDB
} = require("./database/mongodb");

async function testDatabase() {
    try {
        const database = await connectMongoDB();

        console.log("연결된 DB:", database.databaseName);

    } catch (error) {
        console.error("연결 오류:", error);

    } finally {
        await closeMongoDB();
    }
}

testDatabase();