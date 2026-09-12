const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();
routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

const PAGES_DIR = path.join(__dirname, "../pages");
const TEMPLATE_DIR = path.join(PAGES_DIR, "html", "tamplate.html");
routes.use("/css", express.static(path.join(PAGES_DIR, "css")));
routes.use("/js", express.static(path.join(PAGES_DIR, "js")));

const databasePath = path.join(
    process.cwd(),
    "database",
    "calender"
);

const {
    createCalendar
} = require(
    path.join(databasePath, "create")
);

const {
    readCalendar
} = require(
    path.join(databasePath, "read")
);

const {
    updateCalendar
} = require(
    path.join(databasePath, "update")
);

const {
    deleteCalendar
} = require(
    path.join(databasePath, "delete")
);

routes.get("/", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "schedule.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});

// 일정 조회
routes.post("/read", async (req, res) => {
    try {
        const {
            creator,
            creatorType,
            calendarId,
            startDate,
            endDate
        } = req.body;

        const result = await readCalendar({
            creator,
            creatorType,
            calendarId,
            startDate,
            endDate
        });

        return res.status(200).json({
            success: true,
            calendars: result
        });

    } catch (error) {
        console.error("일정 조회 라우터 오류:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// 일정 생성
routes.post("/create", async (req, res) => {
    try {
        const {
            creator,
            creatorType,
            title,
            description,
            categoryKeywords,
            startDate,
            endDate
        } = req.body;

        const result = await createCalendar({
            creator,
            creatorType,
            title,
            description,
            categoryKeywords,
            startDate,
            endDate
        });

        return res.status(201).json({
            success: true,
            message: "일정이 생성되었습니다.",
            calendar: result.calendar
        });

    } catch (error) {
        console.error("일정 생성 라우터 오류:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// 일정 수정
routes.post("/update", async (req, res) => {
    try {
        const {
            calendarId,
            creator,
            creatorType,
            title,
            description,
            categoryKeywords,
            startDate,
            endDate
        } = req.body;

        const result = await updateCalendar({
            calendarId,
            creator,
            creatorType,
            title,
            description,
            categoryKeywords,
            startDate,
            endDate
        });

        return res.status(200).json({
            success: true,
            message: "일정이 수정되었습니다.",
            calendar: result.calendar
        });

    } catch (error) {
        console.error("일정 수정 라우터 오류:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// 일정 삭제
routes.post("/delete", async (req, res) => {
    try {
        const {
            calendarId,
            creator,
            creatorType
        } = req.body;

        const result = await deleteCalendar({
            calendarId,
            creator,
            creatorType
        });

        return res.status(200).json({
            success: true,
            message: "일정이 삭제되었습니다.",
            deletedId: result.deletedId
        });

    } catch (error) {
        console.error("일정 삭제 라우터 오류:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});



function renderTemplate(pagePath) {
    const templatePath = path.join(TEMPLATE_DIR);

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