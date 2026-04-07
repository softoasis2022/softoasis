let data = {
    apple: [
        "A1203",
        "A1324",
        "A1303",
        "A1332",
        "A1387",
        "A1428",
        "A1457",
        "A1533",
        "A1549",
        "A1586",
        "A1633",
        "A1660",
        "A1778",
        "A1863",
        "A1905",
        "A1865",
        "A1901",
        "A1984",
        "A1920",
        "A1921",
        "A2111",
        "A2160",
        "A2218",
        "A1662",
        "A2275",
        "A2595",
        "A2176",
        "A2172",
        "A2341",
        "A2342",
        "A2628",
        "A2633",
        "A2636",
        "A2641",
        "A2649",
        "A2632",
        "A2650",
        "A2651",
        "A3090",
        "A3094",
        "A3101",
        "A3105",
        "A3286",
        "A3290",
        "A3293",
        "A3297"
    ],
    samsung: {
        "Galaxy_S": [
            "SM-G900",
            "SM-G901",
            "SM-G903",
            "SM-G920",
            "SM-G925",
            "SM-G928",
            "SM-G930",
            "SM-G935",
            "SM-G950",
            "SM-G955",
            "SM-G960",
            "SM-G965",
            "SM-G970",
            "SM-G973",
            "SM-G975",
            "SM-G980",
            "SM-G981",
            "SM-G985",
            "SM-G988",
            "SM-G990",
            "SM-G991",
            "SM-G996",
            "SM-G998",
            "SM-S901",
            "SM-S906",
            "SM-S908",
            "SM-S911",
            "SM-S916",
            "SM-S918",
            "SM-S921",
            "SM-S926",
            "SM-S928"
        ],
        "Galaxy_Note": [
            "SM-N900",
            "SM-N9005",
            "SM-N910",
            "SM-N915",
            "SM-N920",
            "SM-N925",
            "SM-N930",
            "SM-N935",
            "SM-N950",
            "SM-N960",
            "SM-N970",
            "SM-N975",
            "SM-N980",
            "SM-N985"
        ],
        "Galaxy_A": [
            "SM-A100",
            "SM-A102",
            "SM-A105",
            "SM-A115",
            "SM-A125",
            "SM-A135",
            "SM-A145",
            "SM-A205",
            "SM-A210",
            "SM-A215",
            "SM-A217",
            "SM-A305",
            "SM-A310",
            "SM-A320",
            "SM-A405",
            "SM-A415",
            "SM-A505",
            "SM-A510",
            "SM-A515",
            "SM-A705",
            "SM-A710",
            "SM-A715",
            "SM-A805",
            "SM-A905",
            "SM-A910"
        ],
        "Galaxy_Z": [
            "SM-F700",
            "SM-F707",
            "SM-F711",
            "SM-F721",
            "SM-F731",
            "SM-F741B",
            "SM-F741N",
            "SM-F900",
            "SM-F907",
            "SM-F916",
            "SM-F926",
            "SM-F936",
            "SM-F946",
            "SM-F955",
            "SM-F956B",
            "SM-F956N"
        ],
        "Galaxy_J": [
            "SM-J100",
            "SM-J105",
            "SM-J200",
            "SM-J210",
            "SM-J320",
            "SM-J330",
            "SM-J400",
            "SM-J410",
            "SM-J500",
            "SM-J510",
            "SM-J600",
            "SM-J610",
            "SM-J700",
            "SM-J710",
            "SM-J730"
        ],
        "Galaxy_M": [
            "SM-M105",
            "SM-M115",
            "SM-M205",
            "SM-M215",
            "SM-M305",
            "SM-M315",
            "SM-M325",
            "SM-M515",
            "SM-M526",
            "SM-M536"
        ]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // 페이지 로드가 끝나면 서버에 POST 요청
    fetch("/devicelist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: "getData" }) // 서버에 보낼 내용
    })
        .then(res => res.json()) // 응답을 JSON으로 변환
        .then(json => {
            // 받은 데이터를 data에 저장
            data = json;

            // 레이아웃 생성
            complaterayout();
        })
        .catch(err => console.error("에러 발생:", err));
});

function complaterayout() {
    const container = document.getElementById("layout");

    // 기존 내용 제거
    container.innerHTML = "";

    // data 배열을 순회하며 DOM 요소 생성
    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>모델명: ${item.modelname}</p>
            <p>모델번호: ${item.modelnumber}</p>
            <p>가격: ${item.price}</p>
        `;

        container.appendChild(div);
    });
}