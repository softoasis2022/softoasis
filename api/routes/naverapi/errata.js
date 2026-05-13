const https = require("https");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");

// ==============================
// 🔥 네이버 백과사전 검색 함수
// ==============================
function searchEncyc(query) {

    return new Promise((resolve, reject) => {

        // ==============================
        // 🔥 쿼리 스트링 생성
        // ==============================
        const params = querystring.stringify({
            query
        });

        // ==============================
        // 🔥 요청 옵션
        // ==============================

        const headers = JSON.parse(fs.readFileSync(path.join(__dirname,"./headers.json"),"utf-8"));
        const options = {
            hostname: "openapi.naver.com",
            path: `/v1/search/errata.json${params}`,
            method: "GET",
            headers
        };

        // ==============================
        // 🔥 요청 시작
        // ==============================
        const req = https.request(options, (res) => {

            let data = "";

            // 데이터 받기
            res.on("data", (chunk) => {
                data += chunk;
            });

            // 완료
            res.on("end", () => {

                try {

                    const json = JSON.parse(data);

                    resolve({
                        success: true,
                        status: res.statusCode,
                        data: json
                    });

                } catch (err) {

                    reject({
                        success: false,
                        error: "JSON 파싱 실패",
                        detail: err
                    });

                }

            });

        });

        // 에러
        req.on("error", (err) => {

            reject({
                success: false,
                error: "요청 실패",
                detail: err
            });

        });

        req.end();

    });

}

// ==============================
// 🔥 테스트 실행
// ==============================
async function test() {

    try {

        const result = await searchEncyc({
            query : "아버지 가방에 들어가시다"
        });

        console.log("검색 성공");
        console.log(JSON.stringify(result, null, 4));

    } catch (err) {

        console.log("검색 실패");
        console.log(err);

    }

}

test();