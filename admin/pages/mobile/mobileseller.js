document.addEventListener("DOMContentLoaded", () => {
    // 등록 폼
    const sellerAddForm =
        document.querySelector(".seller_add_form");

    const sellerInfoSection =
        document.getElementById("sellerInfoSection");

    // 검색 및 목록 요소
    const searchForm =
        document.getElementById("sellerSearchForm");

    const tableBody =
        document.getElementById("sellerTableBody");

    const resultCount =
        document.getElementById("sellerResultCount");

    const listMessage =
        document.getElementById("sellerListMessage");

    const previousButton =
        document.getElementById("sellerPreviousPage");

    const nextButton =
        document.getElementById("sellerNextPage");

    const pageNumbers =
        document.getElementById("sellerPageNumbers");


    let currentPage = 1;
    let totalPages = 1;
    let currentRequest = null;


    /*
     * 모바일셀러 등록
     */
    if (sellerAddForm) {
        sellerAddForm.addEventListener(
            "submit",
            async event => {
                event.preventDefault();

                const submitButton =
                    sellerAddForm.querySelector(
                        ".submit_button"
                    );

                if (!submitButton) {
                    console.error(
                        "등록 버튼을 찾을 수 없습니다."
                    );

                    return;
                }

                try {
                    submitButton.disabled = true;
                    submitButton.textContent = "등록 중...";

                    const formData =
                        new FormData(sellerAddForm);

                    const sellerData =
                        Object.fromEntries(
                            formData.entries()
                        );

                    const response = await fetch(
                        sellerAddForm.action,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify(
                                sellerData
                            )
                        }
                    );

                    const result =
                        await parseResponse(response);

                    if (!response.ok || !result.success) {
                        throw new Error(
                            result.message ||
                            "모바일셀러 등록에 실패했습니다."
                        );
                    }

                    alert(
                        result.message ||
                        "모바일셀러가 등록되었습니다."
                    );

                    sellerAddForm.reset();

                    // 등록 후 목록 다시 조회
                    if (searchForm) {
                        await loadSellers(1);
                    }

                } catch (error) {
                    console.error(
                        "모바일셀러 등록 오류:",
                        error
                    );

                    alert(
                        error.message ||
                        "서버와 통신하는 중 오류가 발생했습니다."
                    );

                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent =
                        "모바일셀러 등록";
                }
            }
        );
    }


    /*
     * 목록 영역이 없는 페이지에서는
     * 여기서 목록 관련 코드 실행 종료
     */
    const hasSellerList = Boolean(
        searchForm &&
        tableBody &&
        resultCount &&
        listMessage &&
        previousButton &&
        nextButton &&
        pageNumbers
    );

    if (!hasSellerList) {
        return;
    }


    /*
     * 모바일셀러 목록 조회
     */
    async function loadSellers(page = 1) {
        if (currentRequest) {
            currentRequest.abort();
        }

        const requestController =
            new AbortController();

        currentRequest = requestController;

        showLoading();

        try {
            const formData =
                new FormData(searchForm);

            const requestData = {
                searchType:
                    formData.get("searchType") || "",

                keyword:
                    String(
                        formData.get("keyword") || ""
                    ).trim(),

                status:
                    formData.get("status") || "",

                page
            };

            const response = await fetch(
                searchForm.action,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(requestData),

                    signal: requestController.signal
                }
            );

            const result =
                await parseResponse(response);

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    "판매자 조회에 실패했습니다."
                );
            }

            const sellers =
                Array.isArray(result.sellers)
                    ? result.sellers
                    : [];

            currentPage = Math.max(
                Number(result.pagination?.page) ||
                page,
                1
            );

            totalPages = Math.max(
                Number(
                    result.pagination?.totalPages
                ) || 1,
                1
            );

            const totalCount =
                Number(
                    result.pagination?.totalCount
                ) || 0;

            renderSellerList(sellers);
            renderPagination();

            resultCount.textContent =
                `전체 ${totalCount.toLocaleString("ko-KR")}명`;

            hideMessage();

        } catch (error) {
            if (error.name === "AbortError") {
                return;
            }

            console.error(
                "모바일셀러 조회 오류:",
                error
            );

            renderEmpty(
                error.message ||
                "판매자 정보를 불러오지 못했습니다."
            );

            resultCount.textContent = "전체 0명";

            pageNumbers.replaceChildren();

            previousButton.disabled = true;
            nextButton.disabled = true;

            showMessage(
                error.message ||
                "판매자 정보를 불러오지 못했습니다."
            );

        } finally {
            if (
                currentRequest === requestController
            ) {
                currentRequest = null;
            }
        }
    }


    /*
     * 판매자 목록 출력
     */
    function renderSellerList(sellers) {
        tableBody.replaceChildren();

        if (sellers.length === 0) {
            renderEmpty(
                "조건에 맞는 모바일셀러가 없습니다."
            );

            return;
        }

        for (const seller of sellers) {
            const row =
                document.createElement("tr");

            appendTextCell(
                row,
                seller.sellerId || "-"
            );

            appendTextCell(
                row,
                seller.sellerName || "-"
            );

            appendTextCell(
                row,
                seller.storeName || "-"
            );

            appendTextCell(
                row,
                formatPhone(seller.phone)
            );

            appendTextCell(
                row,
                seller.region || "-"
            );

            appendTextCell(
                row,
                `${formatNumber(
                    seller.productCount
                )}개`
            );

            row.appendChild(
                createStatusCell(seller.status)
            );

            row.appendChild(
                createDateCell(seller.createdAt)
            );

            row.appendChild(
                createManagementCell(seller)
            );

            tableBody.appendChild(row);
        }
    }


    /*
     * 일반 테이블 셀
     */
    function appendTextCell(row, value) {
        const cell =
            document.createElement("td");

        cell.textContent = value;
        row.appendChild(cell);
    }


    /*
     * 판매자 상태 셀
     */
    function createStatusCell(status) {
        const cell =
            document.createElement("td");

        const statusElement =
            document.createElement("span");

        const statusList = {
            active: {
                text: "정상 운영",
                className: "active"
            },

            pending: {
                text: "승인 대기",
                className: "pending"
            },

            suspended: {
                text: "이용 정지",
                className: "suspended"
            },

            withdrawn: {
                text: "탈퇴",
                className: "withdrawn"
            }
        };

        const statusInfo =
            statusList[status] || {
                text: "상태 미정",
                className: "unknown"
            };

        statusElement.className =
            `seller_status ${statusInfo.className}`;

        statusElement.textContent =
            statusInfo.text;

        cell.appendChild(statusElement);

        return cell;
    }


    /*
     * 가입일 셀
     */
    function createDateCell(createdAt) {
        const cell =
            document.createElement("td");

        const formattedDate =
            formatDate(createdAt);

        if (formattedDate === "-") {
            cell.textContent = "-";
            return cell;
        }

        const time =
            document.createElement("time");

        time.dateTime = formattedDate;
        time.textContent = formattedDate;

        cell.appendChild(time);

        return cell;
    }


    /*
     * 상세보기 및 수정 버튼
     */
    function createManagementCell(seller) {
        const cell =
            document.createElement("td");

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "management_buttons";

        const rawSellerId =
            seller.sellerId ||
            seller._id ||
            "";

        const sellerId =
            encodeURIComponent(rawSellerId);


        // 상세보기 버튼
        const detailButton =
            document.createElement("button");

        detailButton.type = "button";
        detailButton.className =
            "seller_detail_button";

        detailButton.textContent = "상세보기";

        detailButton.addEventListener(
            "click",
            () => {
                renderSellerDetail(seller);
            }
        );


        // 수정 링크
        const editLink =
            document.createElement("a");

        editLink.href =
            `/mobile/mobileseller/${sellerId}/edit`;

        editLink.textContent = "수정";


        wrapper.append(
            detailButton,
            editLink
        );

        cell.appendChild(wrapper);

        return cell;
    }
    /*
     * 선택한 판매자 상세정보 출력
     */
    function renderSellerDetail(seller) {
        if (!sellerInfoSection) {
            return;
        }

        sellerInfoSection.replaceChildren();
        sellerInfoSection.hidden = false;


        // 상세정보 제목 영역
        const header =
            document.createElement("div");

        header.className =
            "seller_info_header";


        const titleArea =
            document.createElement("div");

        const title =
            document.createElement("h2");

        title.id = "sellerInfoTitle";
        title.textContent =
            seller.sellerName
                ? `${seller.sellerName} 상세정보`
                : "모바일셀러 상세정보";


        const description =
            document.createElement("p");

        description.textContent =
            "선택한 모바일셀러의 등록 정보를 확인할 수 있습니다.";


        titleArea.append(
            title,
            description
        );


        // 닫기 버튼
        const closeButton =
            document.createElement("button");

        closeButton.type = "button";
        closeButton.className =
            "seller_info_close_button";

        closeButton.textContent = "닫기";

        closeButton.addEventListener(
            "click",
            () => {
                closeSellerDetail();
            }
        );


        header.append(
            titleArea,
            closeButton
        );


        // 상태 표시
        const statusInfo =
            getStatusInfo(seller.status);

        const statusElement =
            document.createElement("span");

        statusElement.className =
            `seller_status ${statusInfo.className}`;

        statusElement.textContent =
            statusInfo.text;


        // 상세정보 그리드
        const informationGrid =
            document.createElement("div");

        informationGrid.className =
            "seller_info_grid";


        appendSellerInfo(
            informationGrid,
            "판매자 번호",
            seller.sellerId || "-"
        );

        appendSellerInfo(
            informationGrid,
            "판매자명",
            seller.sellerName || "-"
        );

        appendSellerInfo(
            informationGrid,
            "매장명",
            seller.storeName || "-"
        );

        appendSellerInfo(
            informationGrid,
            "전화번호",
            formatPhone(seller.phone)
        );

        appendSellerInfo(
            informationGrid,
            "사업자등록번호",
            formatBusinessNumber(
                seller.businessNumber
            )
        );

        appendSellerInfo(
            informationGrid,
            "지역",
            seller.region || "-"
        );

        appendSellerInfo(
            informationGrid,
            "매장 주소",
            seller.address || "-",
            true
        );

        appendSellerInfo(
            informationGrid,
            "운영 상태",
            statusElement
        );

        appendSellerInfo(
            informationGrid,
            "등록 상품 수",
            `${formatNumber(
                seller.productCount
            )}개`
        );

        appendSellerInfo(
            informationGrid,
            "가입일",
            formatDate(seller.createdAt)
        );

        appendSellerInfo(
            informationGrid,
            "최근 수정일",
            formatDate(seller.updatedAt)
        );

        appendSellerInfo(
            informationGrid,
            "관리자 메모",
            seller.memo || "등록된 메모가 없습니다.",
            true
        );


        // 하단 버튼
        const actionArea =
            document.createElement("div");

        actionArea.className =
            "seller_info_actions";

        const rawSellerId =
            seller.sellerId ||
            seller._id ||
            "";

        const sellerId =
            encodeURIComponent(rawSellerId);


        const editLink =
            document.createElement("a");

        editLink.className =
            "seller_info_edit_button";

        editLink.href =
            `/mobile/mobileseller/${sellerId}/edit`;

        editLink.textContent =
            "판매자 정보 수정";


        const closeBottomButton =
            document.createElement("button");

        closeBottomButton.type = "button";
        closeBottomButton.className =
            "seller_info_cancel_button";

        closeBottomButton.textContent = "닫기";

        closeBottomButton.addEventListener(
            "click",
            () => {
                closeSellerDetail();
            }
        );


        actionArea.append(
            closeBottomButton,
            editLink
        );


        sellerInfoSection.append(
            header,
            informationGrid,
            actionArea
        );


        // 상세정보 영역으로 부드럽게 이동
        sellerInfoSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        sellerInfoSection.focus();
    }
    /*
    * 상세정보 항목 생성
    */
    function appendSellerInfo(
        container,
        label,
        value,
        fullWidth = false
    ) {
        const item =
            document.createElement("div");

        item.className =
            "seller_info_item";

        if (fullWidth) {
            item.classList.add(
                "seller_info_item_full"
            );
        }


        const labelElement =
            document.createElement("strong");

        labelElement.className =
            "seller_info_label";

        labelElement.textContent = label;


        const valueElement =
            document.createElement("div");

        valueElement.className =
            "seller_info_value";


        if (value instanceof Node) {
            valueElement.appendChild(value);
        } else {
            valueElement.textContent =
                value ?? "-";
        }


        item.append(
            labelElement,
            valueElement
        );

        container.appendChild(item);
    }
    /*
    * 상세정보 닫기
    */
    function closeSellerDetail() {
        if (!sellerInfoSection) {
            return;
        }

        sellerInfoSection.hidden = true;
        sellerInfoSection.replaceChildren();
    }
    /*
 * 판매자 상태 정보
 */
    function getStatusInfo(status) {
        const statusList = {
            active: {
                text: "정상 운영",
                className: "active"
            },

            pending: {
                text: "승인 대기",
                className: "pending"
            },

            suspended: {
                text: "이용 정지",
                className: "suspended"
            },

            withdrawn: {
                text: "탈퇴",
                className: "withdrawn"
            }
        };

        return statusList[status] || {
            text: "상태 미정",
            className: "unknown"
        };
    }
    /*
 * 사업자등록번호 표시
 */
    function formatBusinessNumber(value) {
        const number = String(value || "")
            .replace(/\D/g, "");

        if (number.length === 10) {
            return number.replace(
                /(\d{3})(\d{2})(\d{5})/,
                "$1-$2-$3"
            );
        }

        return value || "-";
    }
    /*
     * 조회 결과가 없거나 오류가 발생했을 때
     */
    function renderEmpty(message) {
        tableBody.replaceChildren();

        const row =
            document.createElement("tr");

        const cell =
            document.createElement("td");

        cell.colSpan = 9;
        cell.className = "empty_data";
        cell.textContent = message;

        row.appendChild(cell);
        tableBody.appendChild(row);
    }


    /*
     * 페이지 번호 출력
     */
    function renderPagination() {
        pageNumbers.replaceChildren();

        previousButton.disabled =
            currentPage <= 1;

        nextButton.disabled =
            currentPage >= totalPages;

        const maximumButtons = 5;

        const startPage = Math.max(
            1,
            Math.min(
                currentPage - 2,
                totalPages - maximumButtons + 1
            )
        );

        const endPage = Math.min(
            totalPages,
            startPage + maximumButtons - 1
        );

        for (
            let page = startPage;
            page <= endPage;
            page++
        ) {
            const pageButton =
                document.createElement("button");

            pageButton.type = "button";
            pageButton.className =
                "pagination_number";

            pageButton.textContent =
                String(page);

            if (page === currentPage) {
                pageButton.classList.add(
                    "active"
                );

                pageButton.setAttribute(
                    "aria-current",
                    "page"
                );
            }

            pageButton.addEventListener(
                "click",
                () => {
                    loadSellers(page);
                }
            );

            pageNumbers.appendChild(
                pageButton
            );
        }
    }


    /*
     * 로딩 상태
     */
    function showLoading() {
        renderEmpty(
            "모바일셀러 정보를 불러오는 중입니다."
        );

        previousButton.disabled = true;
        nextButton.disabled = true;

        hideMessage();
    }


    /*
     * 오류 및 안내 메시지
     */
    function showMessage(message) {
        listMessage.textContent = message;
        listMessage.hidden = false;
    }


    function hideMessage() {
        listMessage.textContent = "";
        listMessage.hidden = true;
    }


    /*
     * 서버 JSON 응답 처리
     */
    async function parseResponse(response) {
        const contentType =
            response.headers.get("content-type") || "";

        if (
            !contentType.includes(
                "application/json"
            )
        ) {
            return {
                success: false,
                message:
                    "서버가 JSON 형식으로 응답하지 않았습니다."
            };
        }

        return await response.json();
    }


    /*
     * 전화번호 표시
     */
    function formatPhone(phone) {
        const number = String(phone || "")
            .replace(/\D/g, "");

        if (number.length === 11) {
            return number.replace(
                /(\d{3})(\d{4})(\d{4})/,
                "$1-$2-$3"
            );
        }

        if (number.length === 10) {
            return number.replace(
                /(\d{3})(\d{3})(\d{4})/,
                "$1-$2-$3"
            );
        }

        return phone || "-";
    }


    /*
     * 숫자 표시
     */
    function formatNumber(value) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "0";
        }

        return number.toLocaleString("ko-KR");
    }


    /*
     * 날짜 표시
     */
    function formatDate(value) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        const parts =
            new Intl.DateTimeFormat(
                "en-CA",
                {
                    timeZone: "Asia/Seoul",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }
            ).formatToParts(date);

        const dateParts = {};

        for (const part of parts) {
            dateParts[part.type] = part.value;
        }

        return [
            dateParts.year,
            dateParts.month,
            dateParts.day
        ].join("-");
    }


    /*
     * 검색 폼 제출
     */
    searchForm.addEventListener(
        "submit",
        event => {
            event.preventDefault();
            loadSellers(1);
        }
    );


    /*
     * 검색 조건 초기화
     */
    searchForm.addEventListener(
        "reset",
        () => {
            requestAnimationFrame(() => {
                loadSellers(1);
            });
        }
    );


    /*
     * 이전 페이지
     */
    previousButton.addEventListener(
        "click",
        () => {
            if (currentPage > 1) {
                loadSellers(
                    currentPage - 1
                );
            }
        }
    );


    /*
     * 다음 페이지
     */
    nextButton.addEventListener(
        "click",
        () => {
            if (currentPage < totalPages) {
                loadSellers(
                    currentPage + 1
                );
            }
        }
    );


    // 처음 페이지를 열면 목록 조회
    loadSellers(1);
});