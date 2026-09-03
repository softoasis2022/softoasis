const {
    connectMongoDB,
    closeMongoDB
} = require("../mongodb");


async function addProduct(productData) {
    try {
        const database = await connectMongoDB("product");
        const products = database.collection("products");

        // 같은 상품 URL 중복 등록 방지
        await products.createIndex(
            { url: 1 },
            { unique: true }
        );

        const {
            name,
            purchasePrice,
            price,
            originalPrice,
            category,
            brand,
            stock,
            url,
            imageUrl,
            description,
            features,
            isActive
        } = productData;


        // 입력값 정리
        const normalizedName = String(name || "").trim();
        const normalizedCategory = String(category || "").trim();
        const normalizedBrand = String(brand || "").trim();
        const normalizedUrl = String(url || "").trim();
        const normalizedImageUrl = String(imageUrl || "").trim();
        const normalizedDescription = String(description || "").trim();

        const normalizedPurchasePrice = parseNumber(
            purchasePrice,
            "매입 가격"
        );

        const normalizedPrice = parseNumber(
            price,
            "판매 가격"
        );

        const normalizedOriginalPrice = parseOptionalNumber(
            originalPrice,
            "정상 가격"
        );

        const normalizedStock = parseNumber(
            stock,
            "재고 수량"
        );

        const normalizedFeatures = normalizeFeatures(features);

        const normalizedIsActive =
            isActive === true ||
            isActive === "true" ||
            isActive === "on";


        // 상품명 검사
        if (!normalizedName) {
            throw new Error("상품 이름을 입력해주세요.");
        }

        // 카테고리 검사
        if (!normalizedCategory) {
            throw new Error("카테고리를 선택해주세요.");
        }

        // 브랜드 검사
        if (!normalizedBrand) {
            throw new Error("브랜드를 입력해주세요.");
        }

        // 재고는 정수만 허용
        if (!Number.isInteger(normalizedStock)) {
            throw new Error("재고 수량은 정수로 입력해주세요.");
        }

        // 상품 URL 검사
        validateUrl(normalizedUrl, "상품 URL", true);

        // 이미지 URL 검사
        validateUrl(normalizedImageUrl, "이미지 URL", false);


        const currentTime = new Date();

        const newProduct = {
            name: normalizedName,

            purchasePrice: normalizedPurchasePrice,
            price: normalizedPrice,
            originalPrice: normalizedOriginalPrice,

            category: normalizedCategory,
            brand: normalizedBrand,
            stock: normalizedStock,

            url: normalizedUrl,
            imageUrl: normalizedImageUrl,

            description: normalizedDescription,
            features: normalizedFeatures,

            isActive: normalizedIsActive,

            createdAt: currentTime,
            updatedAt: currentTime
        };


        const result = await products.insertOne(newProduct);

        console.log("상품 등록 성공");
        console.log("MongoDB ID:", result.insertedId);
        console.log("상품명:", normalizedName);

        return {
            success: true,
            insertedId: result.insertedId,
            product: newProduct
        };

    } catch (error) {
        if (error.code === 11000) {
            throw new Error("이미 등록된 상품 URL입니다.");
        }

        console.error(
            "상품 등록 실패:",
            error.message
        );

        throw error;

    } finally {
        await closeMongoDB();
    }
}


// 필수 숫자 변환
function parseNumber(value, fieldName) {
    const text = String(value ?? "")
        .replace(/,/g, "")
        .trim();

    if (!text) {
        throw new Error(`${fieldName}을 입력해주세요.`);
    }

    const number = Number(text);

    if (!Number.isFinite(number) || number < 0) {
        throw new Error(
            `올바른 ${fieldName}을 입력해주세요.`
        );
    }

    return number;
}


// 선택 숫자 변환
function parseOptionalNumber(value, fieldName) {
    const text = String(value ?? "")
        .replace(/,/g, "")
        .trim();

    if (!text) {
        return null;
    }

    const number = Number(text);

    if (!Number.isFinite(number) || number < 0) {
        throw new Error(
            `올바른 ${fieldName}을 입력해주세요.`
        );
    }

    return number;
}


// 특장점 배열 변환
function normalizeFeatures(features) {
    if (Array.isArray(features)) {
        return features
            .map(feature => String(feature).trim())
            .filter(Boolean);
    }

    return String(features || "")
        .split(",")
        .map(feature => feature.trim())
        .filter(Boolean);
}


// URL 검사
function validateUrl(url, fieldName, required) {
    if (!url) {
        if (required) {
            throw new Error(`${fieldName}을 입력해주세요.`);
        }

        return;
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(url);
    } catch {
        throw new Error(
            `올바른 ${fieldName}을 입력해주세요.`
        );
    }

    if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
    ) {
        throw new Error(
            `${fieldName}은 http 또는 https 주소여야 합니다.`
        );
    }
}


module.exports = {
    addProduct
};