document.addEventListener("DOMContentLoaded", () => {
    api();
});

const dataindex = {
    "title": "",
    "infodata": ""
}
const data = "";

// 현재 링크로 상품 정보 요청
async function api() {
    try {
        const response = await fetch(window.location.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error(`상품 정보 요청 실패: ${response.status}`);
        }

        data = await response.json();

        console.log("상품 정보:", data);

        // 여기에 상품 정보를 화면에 표시하는 코드 추가

        return data;
    } catch (error) {
        console.error("상품 정보 요청 오류:", error);
        return null;
    }
}

function layoutcomplate(){
    
}