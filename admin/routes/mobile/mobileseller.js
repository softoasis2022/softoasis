const express = require("express");
const { ObjectId } = require("mongodb");

const routes = express.Router();

const {
    connectMongoDB
} = require("../../../database/mongodb");


// 저장을 허용할 필드
const ALLOWED_FIELDS = [
    "sellerName",
    "representativeName",
    "storeName",
    "phone",
    "email",
    "businessNumber",
    "address",
    "description",
    "isActive"
];


// 판매자 등록
routes.post("/create", async (req, res) => {
    try {
        const database = await connectMongoDB("mobile");
        const sellers = database.collection("sellers");

        const sellerData = makeSellerData(req.body);

        if (!sellerData.sellerName) {
            return res.status(400).json({
                success: false,
                message: "판매자 이름을 입력해주세요."
            });
        }

        if (!sellerData.phone) {
            return res.status(400).json({
                success: false,
                message: "전화번호를 입력해주세요."
            });
        }

        const currentTime = new Date();

        const newSeller = {
            ...sellerData,
            createdAt: currentTime,
            updatedAt: currentTime
        };

        const result = await sellers.insertOne(newSeller);

        return res.status(201).json({
            success: true,
            message: "모바일 판매자가 등록되었습니다.",
            sellerId: result.insertedId,
            seller: newSeller
        });

    } catch (error) {
        console.error("판매자 등록 오류:", error);

        return res.status(500).json({
            success: false,
            message: "판매자 등록 중 오류가 발생했습니다."
        });
    }
});


// 판매자 조회
routes.post("/read", async (req, res) => {
    try {
        const database = await connectMongoDB("mobile");
        const sellers = database.collection("sellers");

        const { sellerId } = req.body;

        // ID가 있으면 판매자 한 명 조회
        if (sellerId) {
            const _id = convertObjectId(sellerId);

            const seller = await sellers.findOne({ _id });

            if (!seller) {
                return res.status(404).json({
                    success: false,
                    message: "판매자를 찾을 수 없습니다."
                });
            }

            return res.json({
                success: true,
                seller
            });
        }

        // ID가 없으면 조건에 맞는 판매자 목록 조회
        const filter = makeSellerData(req.body);

        const sellerList = await sellers
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        return res.json({
            success: true,
            count: sellerList.length,
            sellers: sellerList
        });

    } catch (error) {
        console.error("판매자 조회 오류:", error);

        return sendError(res, error, "판매자 조회에 실패했습니다.");
    }
});


// 판매자 수정
routes.post("/update", async (req, res) => {
    try {
        const { sellerId } = req.body;

        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "판매자 번호가 필요합니다."
            });
        }

        const database = await connectMongoDB("mobile");
        const sellers = database.collection("sellers");

        const _id = convertObjectId(sellerId);
        const updateData = makeSellerData(req.body);

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "수정할 정보가 없습니다."
            });
        }

        updateData.updatedAt = new Date();

        const result = await sellers.updateOne(
            { _id },
            {
                $set: updateData
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "판매자를 찾을 수 없습니다."
            });
        }

        return res.json({
            success: true,
            message: "판매자 정보가 수정되었습니다.",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error("판매자 수정 오류:", error);

        return sendError(res, error, "판매자 수정에 실패했습니다.");
    }
});


// 판매자 삭제
routes.post("/delete", async (req, res) => {
    try {
        const { sellerId } = req.body;

        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "판매자 번호가 필요합니다."
            });
        }

        const database = await connectMongoDB("mobile");
        const sellers = database.collection("sellers");

        const _id = convertObjectId(sellerId);

        const result = await sellers.deleteOne({ _id });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "판매자를 찾을 수 없습니다."
            });
        }

        return res.json({
            success: true,
            message: "판매자가 삭제되었습니다.",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error("판매자 삭제 오류:", error);

        return sendError(res, error, "판매자 삭제에 실패했습니다.");
    }
});


// 허용된 필드만 추출
function makeSellerData(data) {
    const sellerData = {};

    for (const field of ALLOWED_FIELDS) {
        if (data[field] === undefined) {
            continue;
        }

        if (field === "phone") {
            sellerData.phone = String(data.phone)
                .replace(/\D/g, "")
                .trim();

            continue;
        }

        if (field === "isActive") {
            sellerData.isActive =
                data.isActive === true ||
                data.isActive === "true" ||
                data.isActive === "on";

            continue;
        }

        sellerData[field] = String(data[field]).trim();
    }

    return sellerData;
}


// MongoDB ObjectId 변환
function convertObjectId(value) {
    const id = String(value || "").trim();

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        throw new Error("올바른 판매자 번호가 아닙니다.");
    }

    return new ObjectId(id);
}


// 공통 오류 응답
function sendError(res, error, defaultMessage) {
    if (error.message.includes("올바른 판매자 번호")) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: defaultMessage
    });
}


module.exports = routes;