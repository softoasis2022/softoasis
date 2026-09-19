document.addEventListener("DOMContentLoaded", () => {
  const userIdEl = document.getElementById("userId");
  const btnIdCheck = document.getElementById("btnIdCheck");
  const idCheckMsg = document.getElementById("idCheckMsg");
  const idCheckedEl = document.getElementById("idChecked");
  const registerForm = document.getElementById("registerForm");

  // ✅ 혹시 id 오타/누락이면 바로 알려주기
  if (!userIdEl || !btnIdCheck || !idCheckMsg || !idCheckedEl || !registerForm) {
    console.error("회원가입 DOM id 누락/오타:", {
      userIdEl, btnIdCheck, idCheckMsg, idCheckedEl, registerForm
    });
    return;
  }

  function setMsg(text, type) {
    idCheckMsg.textContent = text || "";
    idCheckMsg.className = "msg " + (type ? ("msg-" + type) : "");
  }

  userIdEl.addEventListener("input", () => {
    idCheckedEl.value = "0";
    idCheckMsg.textContent = "";
    idCheckMsg.className = "msg";
  });

  btnIdCheck.addEventListener("click", async () => {
    const userId = (userIdEl.value || "").trim();

    if (!userId) {
      setMsg("아이디를 입력하세요.", "bad");
      userIdEl.focus();
      return;
    }
    if (userId.length < 4) {
      setMsg("아이디는 4자 이상으로 입력하세요.", "bad");
      return;
    }

    btnIdCheck.disabled = true;
    setMsg("중복 확인 중...", "info");

    try {
      const res = await fetch("/seller/account/register/idcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data.message || "요청 처리 중 오류가 발생했습니다.", "bad");
        idCheckedEl.value = "0";
        return;
      }

      if (data.available === true) {
        setMsg(data.message || "사용 가능한 아이디입니다.", "ok");
        idCheckedEl.value = "1";
      } else {
        setMsg(data.message || "이미 사용 중인 아이디입니다.", "bad");
        idCheckedEl.value = "0";
      }
    } catch (e) {
      console.error(e);
      setMsg("네트워크 오류가 발생했습니다.", "bad");
      idCheckedEl.value = "0";
    } finally {
      btnIdCheck.disabled = false;
    }
  });

  registerForm.addEventListener("submit", (e) => {
    const pwEl = document.getElementById("password");
    const pw2El = document.getElementById("password2");

    if (!pwEl || !pw2El) {
      e.preventDefault();
      alert("비밀번호 입력칸 id가 없어요. (password / password2 확인)");
      return;
    }

    if (pwEl.value !== pw2El.value) {
      e.preventDefault();
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (idCheckedEl.value !== "1") {
      e.preventDefault();
      alert("아이디 중복체크를 먼저 해주세요.");
      return;
    }
  });
});
