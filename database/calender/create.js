//생성자,생성자 유형(일반유저(user),셀러(seller),어드민(admin)),일정 이름(text),설명(text),카테고리키워드(list(text)),시작날짜(yyyy-mm-dd),끝나는날짜(yyyy-mm-dd),생성날짜(yyyy-mm-dd 시간까지)
//를 디비에 저장

//넘겨받은 데이터 : 생성자,생성자 유형(일반유저(user),셀러(seller),어드민(admin)),일정 이름(text),설명(text),카테고리키워드(list(text)),시작날짜(yyyy-mm-dd),끝나는날짜(yyyy-mm-dd)
//현재 라우터 실행 기준 데이터 생성 : 생성날짜(yyyy-mm-dd 시간까지)

const {
    connectMongoDB
} = require("../mongodb");


// 실제로 존재하는 YYYY-MM-DD 날짜인지 검사
function validateDate(dateValue, fieldName) {
    const normalizedDate = String(dateValue || "").trim();
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(normalizedDate)) {
        throw new Error(
            `${fieldName}는 YYYY-MM-DD 형식이어야 합니다.`
        );
    }

    const [year, month, day] = normalizedDate
        .split("-")
        .map(Number);

    const parsedDate = new Date(
        Date.UTC(year, month - 1, day)
    );

    const isValidDate =
        parsedDate.getUTCFullYear() === year &&
        parsedDate.getUTCMonth() === month - 1 &&
        parsedDate.getUTCDate() === day;

    if (!isValidDate) {
        throw new Error(
            `${fieldName}가 올바른 날짜가 아닙니다.`
        );
    }

    return normalizedDate;
}


// 카테고리 키워드를 배열로 정리
function normalizeCategoryKeywords(keywords) {
    if (!keywords) {
        return [];
    }

    let keywordList = keywords;

    // "행사,할인,쇼핑" 형태도 허용
    if (typeof keywords === "string") {
        keywordList = keywords.split(",");
    }

    if (!Array.isArray(keywordList)) {
        throw new Error(
            "카테고리 키워드는 배열이어야 합니다."
        );
    }

    // 빈 값 제거 및 중복 제거
    return [
        ...new Set(
            keywordList
                .map(keyword => String(keyword).trim())
                .filter(keyword => keyword.length > 0)
        )
    ];
}


// 일정 생성
async function createCalendar(calendarData) {
    const {
        creator,
        creatorType,
        title,
        description,
        categoryKeywords,
        startDate,
        endDate
    } = calendarData;


    // 입력값 정리
    const normalizedCreator =
        String(creator || "").trim();

    const normalizedCreatorType =
        String(creatorType || "").trim().toLowerCase();

    const normalizedTitle =
        String(title || "").trim();

    const normalizedDescription =
        String(description || "").trim();


    // 생성자 검사
    if (!normalizedCreator) {
        throw new Error("생성자 정보가 필요합니다.");
    }


    // 생성자 유형 검사
    const allowedCreatorTypes = [
        "user",
        "seller",
        "admin"
    ];

    if (!allowedCreatorTypes.includes(normalizedCreatorType)) {
        throw new Error(
            "생성자 유형은 user, seller, admin 중 하나여야 합니다."
        );
    }


    // 일정 이름 검사
    if (!normalizedTitle) {
        throw new Error("일정 이름을 입력해주세요.");
    }

    if (normalizedTitle.length > 100) {
        throw new Error(
            "일정 이름은 100자 이하로 입력해주세요."
        );
    }


    // 설명 검사
    if (normalizedDescription.length > 2000) {
        throw new Error(
            "일정 설명은 2,000자 이하로 입력해주세요."
        );
    }


    // 카테고리 키워드 정리
    const normalizedCategoryKeywords =
        normalizeCategoryKeywords(categoryKeywords);


    // 날짜 검사
    const normalizedStartDate =
        validateDate(startDate, "시작 날짜");

    const normalizedEndDate =
        validateDate(endDate, "종료 날짜");


    // YYYY-MM-DD는 문자열 비교 가능
    if (normalizedEndDate < normalizedStartDate) {
        throw new Error(
            "종료 날짜는 시작 날짜보다 빠를 수 없습니다."
        );
    }


    /*
        데이터베이스: calender

        creatorType이 user라면 user 컬렉션
        creatorType이 seller라면 seller 컬렉션
        creatorType이 admin이라면 admin 컬렉션
    */
    const database = await connectMongoDB("calender");

    const calendarCollection = database.collection(
        normalizedCreatorType
    );


    // MongoDB에 저장할 일정
    const newCalendar = {
        creator: normalizedCreator,
        creatorType: normalizedCreatorType,

        title: normalizedTitle,
        description: normalizedDescription,

        categoryKeywords: normalizedCategoryKeywords,

        startDate: normalizedStartDate,
        endDate: normalizedEndDate,

        createdAt: new Date()
    };


    try {
        const result = await calendarCollection.insertOne(
            newCalendar
        );

        console.log("일정 등록 성공");
        console.log("일정 ID:", result.insertedId);
        console.log("생성자 유형:", normalizedCreatorType);
        console.log("저장 컬렉션:", calendarCollection.collectionName);

        return {
            success: true,
            insertedId: result.insertedId,

            calendar: {
                _id: result.insertedId,
                ...newCalendar
            }
        };

    } catch (error) {
        console.error(
            "일정 등록 실패:",
            error.message
        );

        throw error;
    }
}


module.exports = {
    createCalendar
};