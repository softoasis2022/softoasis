const express = require("express");
const path = require("path");
const fs = require("fs");

const routes = express.Router();

const {
    addProduct
} = require("../../database/product/add");


// 페이지 폴더
const PAGES_DIR = path.join(__dirname, "../pages");

const TEMPLATE_PATH = path.join(
    PAGES_DIR,
    "tamplate",
    "tamplate.html"
);


// 요청 데이터 처리
routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));


// CSS
routes.use(
    "/css",
    express.static(
        path.join(PAGES_DIR, "product", "css")
    )
);


// JavaScript
routes.use(
    "/js",
    express.static(
        path.join(PAGES_DIR, "product", "js")
    )
);


// 상품 관리 메인 페이지
routes.get("/", (req, res) => {
    const pagePath = path.join(
        PAGES_DIR,
        "product",
        "html",
        "main.html"
    );

    const result = renderTemplate(pagePath);

    if (!result) {
        return res
            .status(500)
            .send("템플릿 구성 중 오류");
    }

    res.send(result);
});


// 상품 등록 페이지
routes.get("/add", (req, res) => {
    const pagePath = path.join(
        PAGES_DIR,
        "product",
        "html",
        "add.html"
    );

    const result = renderTemplate(pagePath);

    if (!result) {
        return res
            .status(500)
            .send("템플릿 구성 중 오류");
    }

    res.send(result);
});


// 상품 한 개 등록
routes.post("/add", async (req, res) => {
    try {
        const productData = convertFormToProduct(
            req.body
        );

        const result = await addProduct(productData);

        return res.status(201).json({
            success: true,
            message: "상품이 등록되었습니다.",
            productId: result.insertedId,
            product: result.product
        });

    } catch (error) {
        console.error(
            "상품 등록 실패:",
            error.message
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// 여러 상품 한꺼번에 등록
routes.post("/add/bulk", async (req, res) => {
    const submittedProducts = Array.isArray(req.body.products)
        ? req.body.products
        : Object.values(req.body.products || {});

    if (submittedProducts.length === 0) {
        return res.status(400).json({
            success: false,
            message: "등록할 상품이 없습니다."
        });
    }

    const registeredProducts = [];
    const failedProducts = [];

    // addProduct가 연결을 종료하므로 순차적으로 등록
    for (
        let index = 0;
        index < submittedProducts.length;
        index++
    ) {
        const formProduct = submittedProducts[index];

        try {
            const productData = convertFormToProduct(
                formProduct
            );

            const result = await addProduct(productData);

            registeredProducts.push({
                position: index + 1,
                productId: result.insertedId,
                name: productData.name
            });

        } catch (error) {
            failedProducts.push({
                position: index + 1,
                name:
                    formProduct.productName ||
                    "이름 없는 상품",
                message: error.message
            });
        }
    }

    let statusCode = 201;

    if (registeredProducts.length === 0) {
        statusCode = 400;
    } else if (failedProducts.length > 0) {
        statusCode = 207;
    }

    return res.status(statusCode).json({
        success: failedProducts.length === 0,
        message:
            `${registeredProducts.length}개 상품이 등록되었습니다.`,
        registeredCount: registeredProducts.length,
        failedCount: failedProducts.length,
        registeredProducts,
        failedProducts
    });
});


// HTML 폼 데이터를 MongoDB 상품 구조로 변환
function convertFormToProduct(formProduct) {
    return {
        name: formProduct.productName,
        purchasePrice: formProduct.purchasePrice,
        price: formProduct.price,
        originalPrice: formProduct.originalPrice,
        category: formProduct.category,
        brand: formProduct.brand,
        stock: formProduct.stock,
        url: formProduct.productUrl,
        imageUrl: formProduct.imageUrl,
        features: formProduct.features,
        description: formProduct.description,
        isActive:
            formProduct.isActive === "true" ||
            formProduct.isActive === "on"
    };
}


// 공통 템플릿 구성
function renderTemplate(pagePath) {
    try {
        const template = fs.readFileSync(
            TEMPLATE_PATH,
            "utf-8"
        );

        const pageContent = fs.readFileSync(
            pagePath,
            "utf-8"
        );

        return template.replace(
            "<!-- MAIN_CONTENT -->",
            pageContent
        );

    } catch (error) {
        console.error(
            "템플릿 렌더링 실패:",
            error
        );

        return null;
    }
}


module.exports = routes;