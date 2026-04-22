document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // 🔥 trim 처리
    const payload = {
      userId: String(formData.get("userId")).trim(),
      password: String(formData.get("password")).trim(),
    };

    // 🔥 기본값 체크
    if (!payload.userId || !payload.password) {
      alert("아이디 / 비밀번호 입력하세요");
      return;
    }

    try {
      const res = await fetch("/acount/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("응답:", data);

      // 🔥 성공 처리
      if (res.ok && data.success) {
        alert("로그인 성공");

        // 👉 홈 이동 (너 구조)
        window.location.href = "/";
        return;
      }

      // 🔥 실패 처리 (401 포함)
      alert(data.message || "로그인 실패");

    } catch (err) {
      console.error("로그인 요청 에러:", err);
      alert("서버 연결 실패");
    }
  });
});