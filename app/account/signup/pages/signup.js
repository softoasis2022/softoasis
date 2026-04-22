document.addEventListener("DOMContentLoaded", () => {

    const userIdInput = document.getElementById("userId");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");
    const nicknameInput = document.getElementById("nickname");
    const phoneInput = document.getElementById("phonenumber");

    const signupBtn = document.getElementById("signupBtn");

    signupBtn.addEventListener("click", async (e) => {

        e.preventDefault(); // 🔥 폼 submit 막기

        const userId = userIdInput.value.trim();
        const password = passwordInput.value.trim();
        const confirm = confirmInput.value.trim();
        const nickname = nicknameInput.value.trim();
        const phone = phoneInput.value.trim();

        // 1️⃣ 기본 체크
        if (!userId || !password || !confirm || !nickname || !phone) {
            alert("모든 값을 입력하세요");
            return;
        }

        if (password !== confirm) {
            alert("비밀번호 불일치");
            return;
        }

        try {

            // 2️⃣ 아이디 중복 체크
            const checkRes = await fetch("check-id", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId })
            });

            const checkData = await checkRes.json();

            if (!checkRes.ok) {
                alert(checkData.message || "아이디 확인 실패");
                return;
            }

            // 3️⃣ 회원가입
            const createRes = await fetch("/acount/signup/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId,
                    password,
                    nickname,
                    phone
                })
            });

            const createData = await createRes.json();

            if (!createRes.ok) {
                alert(createData.message || "회원가입 실패");
                return;
            }

            // 성공
            alert(`출입증 발급 완료\nPASS ID: ${createData.passId}`);

            // 👉 이동 (너 서버 구조 기준 맞춤)
            window.location.href = "/acount/login";

        } catch (err) {
            console.error(err);
            alert("서버 오류");
        }

    });

});