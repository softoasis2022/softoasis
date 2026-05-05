// 🔥 배송기사용 메시지
function getStaffMessage({ storename, name, phone, address,subaddress, deliveryTime }) {
    return `[배송신청 알림]

${phone} 번호로 등록된
${name}님이
${address}${address}
로 배송 요청 하였습니다.

배송 시작 예정 시간: ${deliveryTime}`;
}

// 🔥 고객용 메시지
function getCustomerMessage({ storename, name, deliveryTime }) {
    return `[${storename}]

${name}님
배송 신청이 완료되었습니다.

배송 시작 예정 시간: ${deliveryTime}

요청하신 내용대로 배송해드리겠습니다.
감사합니다.`;
}

module.exports = {
    getStaffMessage,
    getCustomerMessage
};