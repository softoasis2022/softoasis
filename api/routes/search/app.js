const express = require("express");
const routes = express.Router();

// 🔥 이거 반드시 필요 (app.js에서 해도 됨)
routes.use(express.json());



//appKey=wRJtWmPr2515C5kSSJPeH5F5AiMhyAxU2UKPNcJp
// Node 18 이상이면 fetch 기본 지원
// 아니면 node-fetch 설치 필요

routes.post("/address", async (req, res) => {

    const keyword = req.body.keyword;
    const page = req.body.page || 1;
    const count = req.body.count || 20;
    const searchType = req.body.searchType || "all";

    const lat = req.body.lat;
    const lon = req.body.lon;

    console.log("🔥 검색어:", keyword);
    console.log("📍 위치:", lat, lon);

    if (!keyword || keyword.trim() === "") {
        return res.status(400).json({ error: "keyword 필요" });
    }

    try {

        const url =
            `https://apis.openapi.sk.com/tmap/pois`
            + `?version=1`
            + `&page=${page}`
            + `&count=${count}`
            + `&searchKeyword=${encodeURIComponent(keyword)}`
            + `&searchType=${searchType}`
            + `&searchtypCd=R`
            + `&radius=20`
            + `&centerLat=${lat}`
            + `&centerLon=${lon}`
            + `&resCoordType=WGS84GEO`
            + `&reqCoordType=WGS84GEO`;

        console.log("🌐 요청 URL:", url);

        const response = await fetch(url, {
            headers: {
                appKey: "wRJtWmPr2515C5kSSJPeH5F5AiMhyAxU2UKPNcJp"
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("❌ Tmap 오류:", text);
            return res.status(500).json({ error: "Tmap API 실패" });
        }

        const data = await response.json();

        const pois = data?.searchPoiInfo?.pois?.poi;

        console.log("🔎 결과 개수:", pois?.length);
        console.log(pois);

        let resdata = [];

        if (pois && Array.isArray(pois)) {
            for (let i = 0; i < pois.length; i++) {

                const p = pois[i];

                resdata.push({
                    name: p.name,
                    address: `${p.upperAddrName || ""} ${p.middleAddrName || ""} ${p.lowerAddrName || ""} ${p.roadName || ""} ${p.firstBuildNo || ""} (${p.name || ""})`.trim()
                });
            }
        }
        console.log(resdata);

        // 🔥 최종 응답
        res.json({
            success: true,
            resdata
        });

    } catch (e) {
        console.error("❌ 서버 에러:", e);
        res.status(500).json({ error: "서버 오류" });
    }
});

module.exports = routes;