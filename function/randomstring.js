// 1️⃣ 랜덤 문자열 (24자리 기본)
function generateRandomString(length = 24) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }

    return result;
}


// 2️⃣ 숫자 생성 (길이 지정 가능)
function generateRandomNumber(length = 6) {
    const chars = "0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    console.log(result);
    return result;
}

generateRandomNumber();

/**
 * export
 */
module.exports = {
    generateRandomString,
    generateRandomNumber
};