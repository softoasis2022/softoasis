document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {
      userId: String(formData.get("userId") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    if (!payload.userId || !payload.password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 서버에서 리디렉션한 경우 해당 주소로 이동
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      const contentType =
        res.headers.get("content-type") || "";

      let data = {};

      // JSON 응답일 때만 변환
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        console.error(
          "예상하지 못한 서버 응답:",
          res.status,
          await res.text()
        );

        alert("서버 응답 형식을 확인해주세요.");
        return;
      }

      if (!res.ok || data.success === false) {
        console.warn("로그인 실패:", data.message);
        alert(data.message || "로그인에 실패했습니다.");
        return;
      }

      console.log("로그인 성공");
      window.location.href = data.redirectUrl || "/";
    } catch (err) {
      console.error("로그인 요청 에러:", err);
      alert("로그인 요청 처리 중 오류가 발생했습니다.");
    }
  });
});