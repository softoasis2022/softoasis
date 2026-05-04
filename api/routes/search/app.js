const express = require("express");
const routes = express.Router();

// Node 18 미만이면 필요
// const fetch = require("node-fetch");

routes.get("/address", async (req, res) => {

    const keyword = req.query.keyword;

    // 🔥 1. 입력값 체크
    if (!keyword || keyword.trim() === "") {
        return res.status(400).json({ error: "keyword 필요" });
    }

    try {

        // 🔥 2. Tmap 요청
        const response = await fetch(
            `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(keyword)}&count=20`,
            {
                headers: {
                    appKey: process.env.TMAP_KEY // 🔥 환경변수 사용
                }
            }
        );

        const data = await response.json();

        const pois = data?.searchPoiInfo?.pois?.poi;
        console.log(data);

        // 🔥 3. 데이터 가공 (핵심)
        const result = (pois || []).map(p => ({
            name: p.name,
            address: `${p.upperAddrName || ""} ${p.middleAddrName || ""} ${p.lowerAddrName || ""} ${p.detailAddrName || ""}`.trim(),
            lat: p.noorLat,
            lon: p.noorLon
        }));

        // 🔥 4. 응답
        res.json({
            success: true,
            count: result.length,
            list: result
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "API 실패" });
    }
});

module.exports = routes;