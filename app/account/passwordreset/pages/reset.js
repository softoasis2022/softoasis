document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("resetForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById("newPassword").value.trim();
        const confirm = document.getElementById("confirmPassword").value.trim();

        if (!newPassword || !confirm) {
            alert("모든 값을 입력하세요");
            return;
        }

        if (newPassword !== confirm) {
            alert("비밀번호가 일치하지 않습니다");
            return;
        }

        try {

            // 🔥 URL에서 토큰 가져오기
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");

            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token,
                    newPassword
                })
            });

            const data = await res.json();

            if (data.success) {
                alert("비밀번호 변경 완료");

                // 로그인 이동
                window.location.href = "/login";
            } else {
                alert(data.message || "실패");
            }

        } catch (err) {
            console.error(err);
            alert("서버 오류");
        }

    });

});