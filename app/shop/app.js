const express = require("express");
const routes  = express.Router();
const path = require("path");
const fs = require("fs");

const database = path.join("Z:", "HDD1", "database");
const developerdatabase = path.join(__dirname,"database");
const PAGES_DIR = path.join(__dirname,"./routes","main","pages");
const TEMPLATE_PATH =path.join(__dirname,"./routes","tamplate", "pages", "html", "index.html");

routes.use("/css", express.static(path.join(PAGES_DIR, "css")));
routes.use("/js", express.static(path.join(PAGES_DIR, "js")));

const mainroutes = require("./routes/main/app");
const brendroutes = require("./routes/brend/brend");
routes.use("/main",mainroutes);



// const mainroutes =require("./routes/main/app");

// routes.use("/",mainroutes);

//결제창
//


routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "index.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/category", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "category.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/brend", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "brend.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

routes.post("/bill",(req,res)=>{
    const {} = req.query;
    const coinrowdata = JSON.parse(fs.readFileSync(path.join(developerdatabase,"bill.json"),"utf-8"));
    res.json(coinrowdata);
});
routes.use("/brend",brendroutes);
routes.use("/delivery", require("./routes/delivery/app"));

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


module.exports=routes;