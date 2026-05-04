const express = require("express");
const routes = express.Router();

routes.get("/address", async (req, res) => {

    const keyword = req.query.keyword;

    try {
        const response = await fetch(
            `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(keyword)}&count=20&appKey=YOUR_APP_KEY`
        );

        const data = await response.json();

        res.json(data);

    } catch (e) {
        res.status(500).json({ error: "API 실패" });
    }
});

module.exports = routes;