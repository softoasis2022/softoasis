const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const database = path.join("C:", "database");
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const PAGES_DIR = path.join(ROOT, "pages");
const TEMPLATE_PATH = path.join(PAGES_DIR,"html", "tamplate.html");

routes.use("/css", express.static(path.join(__dirname, "pages","css")));
routes.use("/js", express.static(path.join(__dirname, "pages","js")));



routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "main.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/cs", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "cs.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/service", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "service.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/partners", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "partners.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/mypage", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "mypage.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/company", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "company.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/team", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "team.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/notice", (req, res) => {
    const pagePath = path.join(PAGES_DIR,"html", "Notice.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

routes.post("/team", (req, res) => {
    try {
        const filePath = path.join(database, "HR", "member.json");

        const fileData = fs.readFileSync(filePath, "utf-8");
        const raw = JSON.parse(fileData);

        const teams = [];

        // 🔥 부서 반복
        for (const deptKey in raw) {
            const dept = raw[deptKey];

            const team = {
                teamKey: deptKey.toLowerCase(),
                teamName: dept.name,
                members: []
            };

            // 🔥 그룹 반복
            for (const groupKey in dept.groups) {
                const group = dept.groups[groupKey];

                group.members.forEach(member => {
                    team.members.push({
                        id: member.id,
                        name: member.name,
                        nickname: member.nickname || "",
                        old: calculateAge(member.joinDate), //나이
                        profileimg: "",

                        // 🔥 skills → skill 변환
                        skill: member.skills?.map(s => ({
                            skillname: s.name,
                            skilllogoimgurl: `/image/UI/${s.name.toLowerCase()}.png`
                        })) || []
                    });
                });
            }

            teams.push(team);
        }

        res.json({ teams });

    } catch (err) {
        console.error("팀 데이터 변환 실패:", err);
        res.status(500).json({ error: "서버 오류" });
    }
});
// routes.post("/memberinfo", (req, res) => {
//     const pagePath = path.join(database,"HR", "member.json");

//     const result = JSON.parse(pagePath);
//     if (!result) return res.status(500).send("올바르지 않은 데이터 입니다.");

//     res.send("요청 성공");
// });
routes.post("/cs",require("./routes/cs/app"));

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
function calculateAge(dateString) {
    if (!dateString) return "";

    const birthYear = new Date(dateString).getFullYear();
    const currentYear = new Date().getFullYear();

    return currentYear - birthYear;
}
module.exports = routes;
