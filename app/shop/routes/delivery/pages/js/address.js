/* =========================
   🔥 DOM
========================= */
const openPopupBtn = document.getElementById("openPopupBtn");
const popup = document.getElementById("addressPopup");
const closeBtn = document.getElementById("closeBtn");

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

/* =========================
   🔥 팝업 열기
========================= */
openPopupBtn.onclick = () => {
    popup.style.display = "flex";
};

/* =========================
   🔥 팝업 닫기
========================= */
closeBtn.onclick = () => {
    popup.style.display = "none";
};

/* =========================
   🔥 검색 요청 (위치 포함)
========================= */
searchBtn.onclick = () => {

    const keyword = searchInput.value.trim();

    if (!keyword) {
        alert("검색어 입력");
        return;
    }

    // 🔥 현재 위치 가져오기
    navigator.geolocation.getCurrentPosition(

        async (pos) => {

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            console.log("📍 현재 위치:", lat, lon);

            try {

                const res = await fetch("/api/search/address", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        keyword: keyword,
                        lat: lat,
                        lon: lon
                    })
                });

                const data = await res.json();
                layout_address_complate(data.resdata);

                console.log("🔥 서버 응답:", data);

            } catch (err) {
                console.error(err);
                alert("요청 실패");
            }
        },

        // 🔥 위치 실패 시 처리
        (err) => {
            console.error("위치 실패:", err);

            alert("위치 권한을 허용해주세요");

            // 👉 fallback (위치 없이 검색)
            fetchWithoutLocation(keyword);
        },

        {
            enableHighAccuracy: true
        }
    );
};

/* =========================
   🔥 위치 없이 검색 (fallback)
========================= */
async function fetchWithoutLocation(keyword) {

    try {

        const res = await fetch("/api/search/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ keyword })
        });

        const data = await res.json();

        console.log("🔥 위치 없이 응답:", data);

    } catch (err) {
        console.error(err);
    }
}
function layout_address_complate(data) {

    const resultList = document.getElementById("resultList");

    // 🔥 초기화
    resultList.innerHTML = "";

    // 🔥 data가 배열인지 확인
    if (!data || data.length === 0) {
        resultList.innerHTML = "<li>검색 결과 없음</li>";
        return;
    }

    // 🔥 반복
    data.forEach(item => {

        const li = document.createElement("li");

        li.style.display = "flex";
        li.style.flexDirection = "row";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";

        // 🔥 왼쪽 (이름 + 주소)
        const infoDiv = document.createElement("div");

        const name = document.createElement("p");
        name.textContent = item.name;

        const address = document.createElement("p");
        address.textContent = item.address;
        address.style.fontSize = "12px";
        address.style.color = "#aaa";

        infoDiv.appendChild(name);
        infoDiv.appendChild(address);

        // 🔥 버튼
        const btn = document.createElement("button");
        btn.textContent = "선택";

        btn.onclick = () => {
            console.log("선택:", item);

            // 👉 주소 input에 넣기
            document.getElementById("addressInput").value = item.address;

            // 👉 팝업 닫기
            popup.style.display = "none";
        };

        // 🔥 조립
        li.appendChild(infoDiv);
        li.appendChild(btn);

        resultList.appendChild(li);
    });
}