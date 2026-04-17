document.addEventListener("DOMContentLoaded", () => {
    adsdata();
});
function adsdata() {
    console.log("광고 스크립트");
}

const adsimg = [
    "/image/shop/event1.png",
    "/image/shop/event2.png"
];

let index = 0;

function imgreset() {
    const img = document.querySelector(".adsimage");

    setInterval(() => {
        index++;

        if (index >= adsimg.length) {
            index = 0;
        }

        img.src = adsimg[index];
    }, 5000);
}

// 실행
document.addEventListener("DOMContentLoaded", imgreset);