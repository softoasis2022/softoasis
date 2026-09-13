document.addEventListener("DOMContentLoaded", () => {
    const loginForm =
        document.getElementById("adminLoginForm");

    const adminIdInput =
        document.getElementById("adminId");

    const passwordInput =
        document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const loginButton =
        document.getElementById("loginButton");

    const loginMessage =
        document.getElementById("loginMessage");

    function showMessage(message) {
        loginMessage.textContent = message;
        loginMessage.classList.add("show");
    }

    function clearMessage() {
        loginMessage.textContent = "";
        loginMessage.classList.remove("show");
    }

    // 비밀번호 보기/숨기기
    passwordToggle.addEventListener("click", () => {
        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        passwordToggle.textContent =
            isPassword ? "숨기기" : "보기";

        passwordToggle.setAttribute(
            "aria-label",
            isPassword
                ? "비밀번호 숨기기"
                : "비밀번호 표시"
        );
    });

    // 관리자 로그인 요청
    loginForm.addEventListener("submit", async event => {
        event.preventDefault();
        clearMessage();

        const adminId = adminIdInput.value.trim();
        const password = passwordInput.value;

        if (!adminId || !password) {
            showMessage(
                "아이디와 비밀번호를 모두 입력해주세요."
            );

            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "로그인 중...";

        try {
            const response = await fetch(
                loginForm.action,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        adminId,
                        password
                    })
                }
            );

            // 서버의 res.redirect("/home") 처리
            if (response.redirected) {
                window.location.href = response.url;
                return;
            }

            const contentType =
                response.headers.get("content-type") || "";

            let result = {};

            if (contentType.includes("application/json")) {
                result = await response.json();
            }

            if (!response.ok) {
                showMessage(
                    result.message ||
                    "로그인에 실패했습니다."
                );

                return;
            }

            window.location.href =
                result.redirectUrl || "/home";
        } catch (error) {
            console.error("로그인 요청 실패:", error);

            showMessage(
                "서버에 연결할 수 없습니다."
            );
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "로그인";
        }
    });
});