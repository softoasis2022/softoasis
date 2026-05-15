
document.addEventListener("DOMContentLoaded", () => {

    // 폼 가져오기
    const form = document.querySelector(".contact-form");

    // submit 이벤트
    form.addEventListener("submit", async (e) => {

        // 기본 새로고침 막기
        e.preventDefault();

        // 값 가져오기
        const title = document.querySelector("#title").value.trim();
        const email = document.querySelector("#email").value.trim();
        const content = document.querySelector("#content").value.trim();

        // 현재 페이지 링크
        const pageUrl = window.location.href;

        // 간단 검사
        if (!title || !email || !content) {
            alert("모든 내용을 입력해주세요.");
            return;
        }

        // 전송 데이터
        const bodyData = {
            title: title,
            email: email,
            content: content,
            pageUrl: pageUrl
        };

        try {

            // 버튼 잠금
            const submitButton = form.querySelector("button");
            submitButton.disabled = true;
            submitButton.innerText = "전송 중...";

            // 서버 전송
            const response = await fetch("/contact/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });

            // 응답 확인
            if (response.status === 200) {

                alert("문의 내용을 확인 후 답변드리겠습니다.");

                // 입력 초기화
                form.reset();

            } else {

                alert("문의 전송에 실패했습니다.");

            }

        } catch (error) {

            console.error(error);

            alert("서버 연결 중 오류가 발생했습니다.");

        } finally {

            // 버튼 복구
            const submitButton = form.querySelector("button");

            submitButton.disabled = false;
            submitButton.innerText = "문의 전송하기";
        }

    });

});
document.addEventListener("DOMContentLoaded", () => {

    const replyType = document.querySelector("#replyType");

    const emailGroup = document.querySelector("#emailGroup");
    const smsGroup = document.querySelector("#smsGroup");
    const kakaoGroup = document.querySelector("#kakaoGroup");

    const emailInput = document.querySelector("#email");
    const phoneInput = document.querySelector("#phone");
    const kakaoInput = document.querySelector("#kakaoId");

    // 응답 방법 변경
    replyType.addEventListener("change", () => {

        // 모두 숨기기
        emailGroup.classList.add("hidden");
        smsGroup.classList.add("hidden");
        kakaoGroup.classList.add("hidden");

        // required 제거
        emailInput.required = false;
        phoneInput.required = false;
        kakaoInput.required = false;

        // 이메일
        if (replyType.value === "email") {

            emailGroup.classList.remove("hidden");

            emailInput.required = true;
        }

        // 문자
        if (replyType.value === "sms") {

            smsGroup.classList.remove("hidden");

            phoneInput.required = true;
        }

        // 카카오
        if (replyType.value === "kakaotalk") {

            kakaoGroup.classList.remove("hidden");

            kakaoInput.required = true;
        }

    });

});