// ==========================
// 🔥 주소 검색 팝업 모듈
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const popup = document.getElementById("addressPopup");
    const findBtn = document.querySelector(".find-btn");
    const closeBtn = document.getElementById("closeBtn");
    const searchBtn = document.getElementById("searchBtn");
    const resultList = document.getElementById("resultList");
    const addressInput = document.getElementById("addressInput");
    const searchInput = document.getElementById("searchInput");

    // ==========================
    // 🔥 팝업 열기
    // ==========================
    findBtn.onclick = () => {
        popup.style.display = "flex";
        searchInput.focus();
    };

    // ==========================
    // 🔥 팝업 닫기
    // ==========================
    closeBtn.onclick = () => {
        popup.style.display = "none";
    };

    // ==========================
    // 🔥 Enter 검색
    // ==========================
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchBtn.click();
        }
    });

    // ==========================
    // 🔥 검색 함수
    // ==========================
    searchBtn.onclick = async () => {

        const keyword = searchInput.value.trim();

        if (!keyword) {
            alert("검색어 입력");
            return;
        }

        try {

            // 🔥 (추천) 서버 프록시 사용
            const res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);

            const data = await res.json();

            let pois = data.searchPoiInfo?.pois?.poi;

            resultList.innerHTML = "";

            // 🔥 결과 없음
            if (!pois || pois.length === 0) {
                resultList.innerHTML = `<li class="empty">검색 결과 없음</li>`;
                return;
            }

            // 🔥 결과 출력
            pois.forEach(poi => {

                const fullAddress =
                    (poi.upperAddrName || "") + " " +
                    (poi.middleAddrName || "") + " " +
                    (poi.lowerAddrName || "") + " " +
                    (poi.detailAddrName || "");

                const li = document.createElement("li");

                li.innerHTML = `
                    <strong>${poi.name}</strong><br>
                    <span>${fullAddress}</span>
                `;

                // 🔥 클릭 시 주소 입력
                li.onclick = () => {
                    addressInput.value = fullAddress.trim();
                    popup.style.display = "none";
                };

                resultList.appendChild(li);
            });

        } catch (err) {
            console.error(err);
            alert("검색 실패");
        }
    };

});