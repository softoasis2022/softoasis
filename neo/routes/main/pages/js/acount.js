document.addEventListener("DOMContentLoaded", () => {
    cookie();
});

function cookie() {
    console.log("성공");

    const userElements = document.getElementsByClassName("user");

    // 🔥 쿠키에서 userlog 값 가져오기
    const userlog = getCookie("userlog");

    if (userlog) {
        console.log("로그인 상태:", userlog);

        // 🔥 user 클래스 요소들에 값 넣기
        for (let i = 0; i < userElements.length; i++) {
            userElements[i].innerText = userlog;
        }
    } else {
        console.log("로그인 안됨");

        for (let i = 0; i < userElements.length; i++) {
            userElements[i].innerText = "게스트";
        }
    }
}

// 🔥 쿠키 가져오는 함수
function getCookie(name) {
    const cookies = document.cookie.split("; ");

    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split("=");

        if (key === name) {
            return decodeURIComponent(value);
        }
    }

    return null;
}