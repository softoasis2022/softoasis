const express = require("express");
const routes  = express.Router();
const path = require("path");
const fs = require("fs");
const { json } = require("stream/consumers");
const { route } = require("./app");

const database = path.join("C:", "database","chat");

routes.use("/css", express.static(path.join(__dirname, "css")));
routes.use("/js", express.static(path.join(__dirname, "js")));



// routes.use()

//결제창
//

routes.get("/", (req, res) => {
    const { roomnumber } = req.query;

    if (!roomnumber) {
        return res.json({
            message: "roomnumber가 필요합니다"
        });
    }

    try {
        const filePath = path.join(database, "room", `${roomnumber}.json`);

        const roompartners = JSON.parse(
            fs.readFileSync(filePath, "utf-8")
        );

        res.json({
            message: "파트너스 조회 성공",
            partners: roompartners["partners"]
        });

    } catch (err) {
        res.json({
            message: "현재 파트너스가 없습니다"
        });
    }
});

module.exports=routes;