// =========================
// 🔥 타일뷰 생성
// =========================
function renderTileView(container, tiles) {

    container.innerHTML = "";

    tiles.forEach(item => {

        const wrapper = document.createElement("div");

        const a = document.createElement("a");
        a.href = item.href || "#";

        // 👉 기존 HTML 스타일 유지
        a.style.display = "flex";
        a.style.flexDirection = "column";
        a.style.justifyContent = "center";
        a.style.alignItems = "center";
        a.style.width = "200px";
        a.style.height = "200px";

        a.innerHTML = `
            <img src="${item.logoimg || ''}" style="width:100px;height:100px;">
            <p>${item.name || ""}</p>
            <p>${item.subjet || ""}</p>
        `;

        wrapper.appendChild(a);
        container.appendChild(wrapper);
    });
}


// =========================
// 🔥 리스트뷰 생성
// =========================
function renderListView(container, tiles) {

    container.innerHTML = "";

    tiles.forEach(item => {

        const li = document.createElement("li");

        const a = document.createElement("a");
        a.href = item.href || "#";

        a.style.display = "flex";
        a.style.flexDirection = "column";
        a.style.justifyContent = "center";
        a.style.alignItems = "center";
        a.style.width = "200px";
        a.style.height = "200px";

        a.innerHTML = `
            <img src="${item.logoimg || ''}" style="width:100px;height:100px;">
            <p>${item.name || ""}</p>
            <p>${item.subjet || ""}</p>
        `;

        li.appendChild(a);
        container.appendChild(li);
    });
}


// =========================
// 🔥 보기 전환
// =========================
function updateView(toggle, tileView, listView, label) {

    if (toggle.checked) {
        tileView.style.display = "none";
        listView.style.display = "block";
        label.textContent = "리스트 보기";
    } else {
        tileView.style.display = "block";
        listView.style.display = "none";
        label.textContent = "타일 보기";
    }
}


// =========================
// 🔥 메인
// =========================
document.addEventListener("DOMContentLoaded", async () => {

    const tileContainer = document.querySelector(".tileview");
    const listContainer = document.querySelector(".listview ul");
    const toggle = document.getElementById("toggleSwitch");
    const tileView = document.querySelector(".tileview");
    const listView = document.querySelector(".listview");
    const viewLabel = document.querySelector("section span");
    const townNameEl = document.querySelector(".townname");

    try {
        // 🔥 데이터 요청
        const currentPath = window.location.pathname;
        const res = await fetch(currentPath + "/data");

        if (!res.ok) throw new Error("데이터 요청 실패");

        const data = await res.json();

        // 타운 이름
        if (data.name) {
            townNameEl.textContent = data.name;
        }

        const tiles = data.tile || [];

        // 🔥 렌더
        renderTileView(tileContainer, tiles);
        renderListView(listContainer, tiles);

        // 🔥 기본 = 리스트뷰
        toggle.checked = true;
        updateView(toggle, tileView, listView, viewLabel);

    } catch (err) {
        console.error(err);
    }

    // 🔥 토글
    toggle.addEventListener("change", () => {
        updateView(toggle, tileView, listView, viewLabel);
    });

});