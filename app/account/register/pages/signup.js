document.addEventListener("DOMContentLoaded", () => {

    const userIdInput = document.getElementById("userId");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");
    const signupBtn = document.getElementById("signupBtn");

    signupBtn.addEventListener("click", async () => {

        const userId = userIdInput.value.trim();
        const password = passwordInput.value.trim();
        const confirm = confirmInput.value.trim();

        // 1️⃣ 기본 체크
        if (!userId || !password || !confirm) {
            alert("모든 값을 입력하세요");
            return;
        }

        if (password !== confirm) {
            alert("비밀번호 불일치");
            return;
        }

        try {

            // 🔥 2️⃣ 아이디 중복 체크
            const checkRes = await fetch("/register/check-id", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId })
            });

            const checkData = await checkRes.json();

            if (checkRes.status !== 200) {
                alert(checkData.message);
                return;
            }

            // 🔥 3️⃣ 회원가입
            const createRes = await fetch("/register/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId,
                    password
                })
            });

            const createData = await createRes.json();

            if (createRes.status !== 200) {
                alert(createData.message);
                return;
            }

            // 성공
            alert(`출입증 발급 완료\nPASS ID: ${createData.passId}`);

            // 👉 로그인 이동
            window.location.href = "/login";

        } catch (err) {
            console.error(err);
            alert("서버 오류");
        }

    });


});