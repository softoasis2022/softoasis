async function authenticate() {
    const url = "https://test-bapi.kakaobank.io:12290/api/v1/corp/auth";

    const jsonData = {
        corp_id: "KABANG_CERTAPI_PSEUDO",
        credential: "eddd083ac4aadd638edbee781509052c377c18dbcf9f96b5f40a96d7325ab8e3"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(jsonData),
            signal: AbortSignal.timeout(15000)
        });

        const body = await response.text();

        console.log("상태 코드:", response.status);
        console.log("응답 헤더:", Object.fromEntries(response.headers));
        console.log("응답 내용:", body);

        if (!response.ok) {
            console.error("인증 요청 실패");
            return;
        }
    } catch (error) {
        console.error("요청 오류:", error.message);

        if (error.cause) {
            console.error("상세 원인:", error.cause);
        }
    }
}

authenticate();