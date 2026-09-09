const { ObjectId } = require("mongodb");
const { mobile } = require("./mobile");


// 모바일 판매자 등록
async function createMobileSeller(sellerData) {
    const database = await mobile();
    const sellers = database.collection("mobilesellers");

    const currentTime = new Date();

    const newSeller = {
        sellerName: String(
            sellerData.sellerName || ""
        ).trim(),

        storeName: String(
            sellerData.storeName || ""
        ).trim(),

        phone: String(
            sellerData.phone || ""
        ).replace(/\D/g, ""),

        address: String(
            sellerData.address || ""
        ).trim(),

        isActive:
            sellerData.isActive === true ||
            sellerData.isActive === "true" ||
            sellerData.isActive === "on",

        createdAt: currentTime,
        updatedAt: currentTime
    };

    if (!newSeller.sellerName) {
        throw new Error("판매자 이름을 입력해주세요.");
    }

    if (!newSeller.phone) {
        throw new Error("전화번호를 입력해주세요.");
    }

    const result = await sellers.insertOne(newSeller);

    return {
        success: true,
        insertedId: result.insertedId,
        seller: newSeller
    };
}


// 모바일 판매자 한 명 조회
async function getMobileSeller(sellerId) {
    const database = await mobile();
    const sellers = database.collection("mobilesellers");

    const _id = convertObjectId(sellerId);

    return await sellers.findOne({ _id });
}


// 모바일 판매자 전체 조회
async function getMobileSellers() {
    const database = await mobile();
    const sellers = database.collection("mobilesellers");

    return await sellers
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
}


// 모바일 판매자 수정
async function updateMobileSeller(sellerId, sellerData) {
    const database = await mobile();
    const sellers = database.collection("mobilesellers");

    const _id = convertObjectId(sellerId);

    const updateData = {
        sellerName: String(
            sellerData.sellerName || ""
        ).trim(),

        storeName: String(
            sellerData.storeName || ""
        ).trim(),

        phone: String(
            sellerData.phone || ""
        ).replace(/\D/g, ""),

        address: String(
            sellerData.address || ""
        ).trim(),

        isActive:
            sellerData.isActive === true ||
            sellerData.isActive === "true" ||
            sellerData.isActive === "on",

        updatedAt: new Date()
    };

    return await sellers.updateOne(
        { _id },
        {
            $set: updateData
        }
    );
}


// 모바일 판매자 삭제
async function deleteMobileSeller(sellerId) {
    const database = await mobile();
    const sellers = database.collection("mobilesellers");

    const _id = convertObjectId(sellerId);

    return await sellers.deleteOne({ _id });
}


function convertObjectId(value) {
    const id = String(value || "").trim();

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        throw new Error("올바른 판매자 번호가 아닙니다.");
    }

    return new ObjectId(id);
}


module.exports = {
    createMobileSeller,
    getMobileSeller,
    getMobileSellers,
    updateMobileSeller,
    deleteMobileSeller
};