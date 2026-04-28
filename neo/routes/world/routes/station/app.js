//station

const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const database = path.join("D:", "database");
// 네 환경 그대로
const imgDB = path.join(database, "image");

routes.use("/pages", express.static(path.join(__dirname, "pages")));
const PAGES_DIR = path.join(__dirname,"pages");
const TEMPLATE_PATH = path.join(__dirname,"pages","html","tamplate.html");

routes.use("/css", express.static(path.join(__dirname, "pages","css")));
routes.use("/js", express.static(path.join(__dirname, "pages","js")));

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "loby.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});


//world 찾기 => station 찾기 => tiket 예약하기
//world 찾기
routes.post("/worldsearch", (req, res) => {
    const { worldkeyword } = req.body;
    // 예: /station?stationId=123
    console.log("월드 검색 요청 받음, 키워드:", worldkeyword);
    try {
        const worldPath = path.join(database, "world", "worldsearch", `${worldkeyword}.json`);

        // 1️⃣ 월드 존재 여부 먼저 확인
        if (!fs.existsSync(worldPath)) {
            return res.status(200).json({
                success: false,
                message: "해당 월드가 존재하지 않습니다."
            });
        }

        // 2️⃣ 존재하면 읽기
        const world = JSON.parse(fs.readFileSync(worldPath, "utf-8"));

        return res.status(200).json({
            success: true,
            message: "검색 결과",
            world
        });

    } catch (err) {
        console.error("월드 검색 중 오류:", err);

        return res.status(500).json({
            success: false,
            message: "월드 검색 중 서버 오류가 발생했습니다."
        });
    }
});
routes.post("/world/station/ticket/stationlist", (req, res) => {
  const { worldId } = req.body;

  if (!worldId) {
    return res.status(400).json({
      success: false,
      message: "worldId가 없습니다"
    });
  }

  // 🔥 여기서 DB에서 worldId에 해당하는 역 목록 조회
  // 예시 더미 데이터
  const stations = [
    { stationId: "ST001", stationName: "중앙역" },
    { stationId: "ST002", stationName: "환승역" },
    { stationId: "ST003", stationName: "메타광장역" }
  ];

  res.json({
    success: true,
    worldId,
    stations
  });
});

routes.post("/orders", (req, res) => {
    const { stationId, qty } = req.body;

    // 1. 역 정보 조회
    // 2. 가격 계산
    // 3. 총 금액 계산
    // 4. 주문번호 생성
    // 5. 결제 페이지용 데이터 반환

    res.json({
        success: true,
        orderId: "TICKET_20260218_0001",
        stationId,
        qty,
        totalPrice: 30000
    });
});
/**
 * 템플릿 렌더링
 */
function renderTemplate(pagePath) {
    const templatePath = path.join(TEMPLATE_PATH);

    try {
        let template = fs.readFileSync(templatePath, "utf-8");
        const pageContent = fs.readFileSync(pagePath, "utf-8");

        return template.replace("<!-- MAIN_CONTENT -->", pageContent);
    } catch (err) {
        console.error("템플릿 렌더링 실패:", err);
        return null;
    }
}


module.exports = routes;
