document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM 로드 완료!");
    layoutcomplate();   // 레이아웃 완성 후 호출
    data();             // 코인 가격 요청
});

function layoutcomplate() {
    console.log("레이아웃 구성 완료!");
}

async function data() {
    try {
        const response = await fetch("localhost/coin/bill", {
            method: "POST",
            headers: {
                "user-id": "USER_UNIQUE_ID_12345",   // ★ 실제 유저 고유번호로 변경
                "Content-Type": "application/json"
            },
            body: JSON.stringify({}) // 요청 파라미터 없음 → 빈 객체 전송
        });

        if (!response.ok) {
            throw new Error("서버 요청 실패: " + response.status);
        }

        const json = await response.json();

        console.log("코인 응답 데이터:", json);

        renderCoinData(json);

    } catch (err) {
        console.error("코인 가격 요청 오류:", err);
    }
}

function renderCoinData(jsonData) {
    const area = document.querySelector("#coin-area");
    if (!area) {
        console.warn("#coin-area 요소 없음");
        return;
    }

    area.innerHTML = `
        <h3>${jsonData.name} 코인 정보</h3>
        <ul>
            ${jsonData.bill
                .map(b => `<li>가격: ${b.price} / 수량: ${b.count}</li>`)
                .join("")}
        </ul>
    `;
}