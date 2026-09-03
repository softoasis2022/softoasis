const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const productTemplate = document.getElementById("productTemplate");

const singleModeButton = document.getElementById(
    "singleModeButton"
);

const bulkModeButton = document.getElementById(
    "bulkModeButton"
);

const addProductButton = document.getElementById(
    "addProductButton"
);

const bulkToolbar = document.getElementById("bulkToolbar");
const submitButton = document.getElementById("submitButton");

const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById(
    "pageDescription"
);

let registerMode = "single";


function addProductItem() {
    const productItem = productTemplate.content.cloneNode(true);

    productList.appendChild(productItem);

    updateProductFields();
}


function updateProductFields() {
    const productItems = productList.querySelectorAll(
        ".product-item"
    );

    productItems.forEach((productItem, index) => {
        const numberElement = productItem.querySelector(
            ".product-number"
        );

        const removeButton = productItem.querySelector(
            ".remove-product-button"
        );

        numberElement.textContent = `상품 ${index + 1}`;

        removeButton.hidden = registerMode === "single";

        const fields = productItem.querySelectorAll(
            "[data-field]"
        );

        fields.forEach(field => {
            const fieldName = field.dataset.field;

            if (registerMode === "bulk") {
                field.name =
                    `products[${index}][${fieldName}]`;
            } else {
                field.name = fieldName;
            }
        });
    });
}


function changeRegisterMode(mode) {
    registerMode = mode;

    const productItems = productList.querySelectorAll(
        ".product-item"
    );

    if (mode === "single") {
        // 한 개 등록으로 변경하면 첫 번째 상품만 남김
        productItems.forEach((productItem, index) => {
            if (index > 0) {
                productItem.remove();
            }
        });

        productForm.action = "/product/add";

        singleModeButton.classList.add("active");
        bulkModeButton.classList.remove("active");

        bulkToolbar.classList.add("hidden");

        pageTitle.textContent = "상품 한 개 등록";

        pageDescription.textContent =
            "새로운 상품의 기본 정보와 판매 정보를 입력합니다.";

        submitButton.textContent = "상품 등록";

    } else {
        productForm.action = "/product/add/bulk";

        singleModeButton.classList.remove("active");
        bulkModeButton.classList.add("active");

        bulkToolbar.classList.remove("hidden");

        pageTitle.textContent = "여러 상품 등록";

        pageDescription.textContent =
            "여러 상품을 입력하고 한 번에 등록합니다.";

        submitButton.textContent = "전체 상품 등록";
    }

    updateProductFields();
}


singleModeButton.addEventListener("click", () => {
    changeRegisterMode("single");
});


bulkModeButton.addEventListener("click", () => {
    changeRegisterMode("bulk");
});


addProductButton.addEventListener("click", () => {
    addProductItem();
});


productList.addEventListener("click", event => {
    if (
        !event.target.classList.contains(
            "remove-product-button"
        )
    ) {
        return;
    }

    const productItems = productList.querySelectorAll(
        ".product-item"
    );

    if (productItems.length <= 1) {
        alert("상품 입력칸은 최소 한 개가 필요합니다.");
        return;
    }

    const productItem = event.target.closest(
        ".product-item"
    );

    productItem.remove();

    updateProductFields();
});


productForm.addEventListener("reset", () => {
    setTimeout(() => {
        updateProductFields();
    }, 0);
});


// 처음 상품 입력칸 한 개 생성
addProductItem();
changeRegisterMode("single");