const express = require("express"); 
const path = require("path"); 
const fs = require("fs");
const routes = express.Router();

const PAGES_DIR = path.join(__dirname,"./routes","world","pages");
const TEMPLATE_PATH = path.join(__dirname,"./routes","world","pages","html","tamplate.html");


const town = require("./routes/town/app");
const station = require("./routes/station/app");
const pass = require("./routes/pass/app");

routes.use("/town", town);
routes.use("/station", station);
routes.use("/pass", pass);


routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "world.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

routes.get("/create", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "world.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
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
