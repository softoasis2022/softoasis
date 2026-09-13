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
routes.get("/detail", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "schedule_detail.html");

    const result = renderTemplate(pagePath);
    if (!result) return res.status(500).send("템플릿 구성 중 오류");

    res.send(result);
});
routes.get("/create", (req, res) => {
    const pagePath = path.join(PAGES_DIR, "html", "schedule_create.html");

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
        //생성자는 컨텐츠id입력
        //생성자 타입은 셀러 유저 어드민

        const {
            creator,
            creatorType,
            title,
            description,
            categoryKeywords,
            startDate,
            endDate
        } = req.body;

        const normalizedTitle = String(
            title || ""
        ).trim();

        const normalizedDescription = String(
            description || ""
        ).trim();

        if (!creator) {
            throw new Error("일정 생성자 정보가 필요합니다.");
        }

        if (!creatorType) {
            throw new Error("일정 생성자 유형이 필요합니다.");
        }

        if (!normalizedTitle) {
            throw new Error("일정 제목이 필요합니다.");
        }

        if (!startDate || !endDate) {
            throw new Error(
                "일정의 시작일과 종료일이 필요합니다."
            );
        }

        // MongoDB Date 타입으로 저장하기 위한 변환
        const parsedStartDate = convertToKoreanDate(
            startDate,
            false
        );

        const parsedEndDate = convertToKoreanDate(
            endDate,
            true
        );

        if (
            parsedEndDate.getTime() <
            parsedStartDate.getTime()
        ) {
            throw new Error(
                "종료일은 시작일보다 빠를 수 없습니다."
            );
        }

        // 문자열 또는 배열 모두 처리
        let normalizedKeywords = [];

        if (Array.isArray(categoryKeywords)) {
            normalizedKeywords = categoryKeywords
                .map(keyword => String(keyword).trim())
                .filter(Boolean);
        } else if (typeof categoryKeywords === "string") {
            normalizedKeywords = categoryKeywords
                .split(",")
                .map(keyword => keyword.trim())
                .filter(Boolean);
        }

        const result = await createCalendar({
            creator: String(creator).trim(),
            creatorType: String(creatorType).trim(),
            title: normalizedTitle,
            description: normalizedDescription,
            categoryKeywords: normalizedKeywords,

            // 문자열이 아니라 Date 객체 전달
            startDate: parsedStartDate,
            endDate: parsedEndDate
        });

        return res.status(201).json({
            success: true,
            message: "일정이 생성되었습니다.",
            calendar: result.calendar
        });
    } catch (error) {
        console.error(
            "일정 생성 라우터 오류:",
            error.message
        );

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

// 날짜 문자열을 대한민국 시간 기준 Date 객체로 변환
function convertToKoreanDate(value, isEndDate = false) {
    const normalizedValue = String(value || "").trim();

    if (!normalizedValue) {
        throw new Error("일정 날짜가 필요합니다.");
    }

    let date;

    // 날짜만 받은 경우: 2026-09-15
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
        const time = isEndDate
            ? "23:59:59.999"
            : "00:00:00.000";

        date = new Date(
            `${normalizedValue}T${time}+09:00`
        );
    }

    // datetime-local 형식: 2026-09-15T13:30
    else if (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(
            normalizedValue
        )
    ) {
        date = new Date(
            `${normalizedValue}+09:00`
        );
    }

    // ISO 형식이나 시간대가 포함된 날짜
    else {
        date = new Date(normalizedValue);
    }

    if (Number.isNaN(date.getTime())) {
        throw new Error("날짜 형식이 올바르지 않습니다.");
    }

    return date;
}

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