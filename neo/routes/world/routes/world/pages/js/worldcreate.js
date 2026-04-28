// ==========================
// 🌍 월드 생성
// ==========================
document.getElementById("worldForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
        worldName: formData.get("worldName"),
        size: formData.get("size"),
        maxUsers: formData.get("maxUsers"),
        station: formData.get("station") === "true",
        type: formData.get("type")
    };

    console.log("월드 생성 데이터:", payload);

    // 👉 서버 전송
    /*
    await fetch("/world/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    */

    alert("월드 생성 요청 완료");
});


// ==========================
// 💳 결제
// ==========================
document.getElementById("paymentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    alert("결제 진행 (여기 API 연결하면 됨)");
});