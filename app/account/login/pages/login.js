document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // ❗ 기본 form submit 막기

    const formData = new FormData(form);
    const payload = {
      userId: formData.get("userId"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("/acount/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ✅ 여기서 응답 콘솔 로그
      //console.log("로그인 응답:", data);
      //console.log("HTTP 상태코드:", res.status);

      if (res.ok) {
        console.log("로그인 성공");
        // 예: location.href = "/main";
        console.log(data);
        if (data.success === true) {
          // ✅ 홈으로 이동
          window.location.href = "/";
        }
      } else {
        console.warn("로그인 실패");
      }

    } catch (err) {
      console.error("로그인 요청 에러:", err);
    }
  });
});
