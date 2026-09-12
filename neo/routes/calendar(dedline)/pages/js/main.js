//로드가 되면 현재 month읽어 옴
function localdate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
}



function datelayoutcomplate() {
    //테이블 테그에 레이아웃 재구성
    //초기레이아웃 구성에도 사용
}
function dateAPI() {
    //플렛폼에 등록한 일정을 가져옴
    //캘린더의 번호로 조회 받아오기
    
    
}
function layoutcomplate(){
    //타이틀바꾸기
    document.title = "캘린더"
    
}

document.addEventListener("DOMContentLoaded", () => {
    dateAPI
    layoutcomplate();//레이아웃 재구성
    const date = localdate();

    console.log(date); // 2026-09
});

