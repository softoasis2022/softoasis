const { MongoClient } = require("mongodb");

// MongoDB 연결 문자열
const uri = "mongodb://user:pass@host:27017/?w=majority";

// MongoClient 생성
const client = new MongoClient(uri);

async function run() {
    try {

        // MongoDB 연결
        await client.connect();

        // DB 선택
        const database = client.db("production");

        // 컬렉션 선택
        const movies = database.collection("movies");

        // 검색 쿼리
        const query = {
            title: "200 meters"
        };

        // 데이터 조회
        const movie = await movies.findOne(query);

        // 출력
        console.log(movie);

    } catch (err) {

        console.error("에러 발생:", err);

    } finally {

        // 연결 종료
        await client.close();

    }
}

// 실행
run().catch(console.dir);