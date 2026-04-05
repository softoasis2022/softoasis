//쿠키에 pass가 있으면
//<li><a href="/acount/login">로그인</a></li>
//이부분에 href를 /softoasis/mypage로 바꾸고
//로그인을 로그아웃으로 변경

document.addEventListener("DOMContentLoaded", async () => {
    const loginLink = document.querySelector('a[href="/acount/login"]');
    if (!loginLink) return;

    try {
        const res = await fetch("/acount/check", {
            credentials: "include"
        });

        const data = await res.json();

        if (!data.login) return;

        // 로그인 상태
        loginLink.textContent = "로그아웃";
        loginLink.href = "/softoasis/mypage";

        loginLink.addEventListener("click", async (e) => {
            e.preventDefault();

            await fetch("/acount/logout", {
                method: "POST",
                credentials: "include"
            });

            location.href = "/";
        });

    } catch (err) {
        console.error("로그인 상태 확인 실패", err);
    }
});