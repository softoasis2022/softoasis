let date = new Date() //인스턴스 선언
const data = [
    { date: '2023-10-15', content: '테스트1' },
    { date: '2023-10-03', content: '테스트2' },
    { date: '2023-9-15', content: '테스트3' },
    { date: '2023-11-26', content: '테스트4' },
    { date: '2023-12-21', content: '테스트5' },
];

//데이터 가공
const calendarList = data.reduce(
    (acc, v) =>
        ({ ...acc, [v.date]: [...(acc[v.date] || []), v.content] })
    , {}
);

//pad method
Number.prototype.pad = function () {
    return this > 9 ? this : '0' + this;
}

const renderCal = (date) => {
    const viewYear = date.getFullYear()
    const viewMonth = date.getMonth() //월은 0부터 시작하므로 +1해야됨.
    const viewDay = date.getDay() //요일은 일요일~토요일까지 0~6까지 표현된다.

    document.querySelector('.date-now').textContent = `${viewYear}년 ${viewMonth + 1}월`

    const firstDay = new Date(date.setDate(1)).getDay();
    const lastDay = new Date(date.getFullYear(), date.getDay(), 0).getDate();

    const limitDay = firstDay + lastDay;
    const nextDay = Math.ceil(limitDay / 7) * 7;

    let htmlDummy = '';

    //날짜 아이템 생성
    for (let i = 0; i < firstDay; i++) {
        htmlDummy += `<div class="noColor"></div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
        let date = `${viewYear}-${viewMonth.pad()}-${i.pad()}`
        htmlDummy += `
    <div class="wrap_date" onclick="location.href='/calender/schedule'">${i}
      <p>${calendarList[date]?.join('</p><p>') || ''}
      </p>
    </div>`
    }

    for (let i = limitDay; i < nextDay; i++) {
        htmlDummy += `<div class="noColor"></div>`;
    }

    //HTML에 날짜 아이템 넣기
    document.querySelector(`.date-board`).innerHTML = htmlDummy;

}



//저번달 달력 생성
document.querySelector(`.date-last`).onclick = () => {
    renderCal(new Date(date.setMonth(date.getMonth() - 1)))
}

//다음달 달력 생성
document.querySelector(`.date-next`).onclick = () => {
    renderCal(new Date(date.setMonth(date.getMonth() + 1)))
}


async function api() {
    try {
        const url = new URL("/calender/schedule/read", window.location.href);
        const params = new URLSearchParams(window.location.search);
        const calenderid = params.get("calenderid");
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                calenderid: calenderid
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "API 요청에 실패했습니다.");
        }

        return result;
    } catch (error) {
        console.error("API 오류:", error);
        throw error;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    //이번달 달력 생성
    renderCal(date);
    api();
});