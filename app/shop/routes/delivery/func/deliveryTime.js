function getNextDeliveryTime() {
    const now = new Date();

    let hour = now.getHours();
    let minute = now.getMinutes();

    // 🔥 30분 단위 계산
    if (minute < 30) {
        minute = 30;
    } else {
        minute = 0;
        hour += 1;
    }

    // 🔥 시간 보정 (24시 넘어갈 경우)
    if (hour === 24) {
        hour = 0;
    }

    // 🔥 포맷 (00:00 형태)
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");

    return `${hh}:${mm}`;
}

module.exports = { getNextDeliveryTime };