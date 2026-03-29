(() => {
  const input = document.getElementById("q");
  const btnSearch = document.getElementById("btnSearch");
  const btnReset = document.getElementById("btnReset");

  const table = document.querySelector("table");
  if (!table) return;

  const rows = Array.from(table.querySelectorAll("tr")).slice(1); // 헤더 제외

  function normalize(s) {
    return (s || "").toString().trim().toLowerCase();
  }

  function applySearch() {
    const q = normalize(input.value);

    rows.forEach((tr) => {
      const text = normalize(tr.textContent);
      const match = q === "" || text.includes(q);
      tr.style.display = match ? "" : "none";
    });
  }

  function resetSearch() {
    input.value = "";
    rows.forEach((tr) => (tr.style.display = ""));
    input.focus();
  }

  btnSearch.addEventListener("click", applySearch);
  btnReset.addEventListener("click", resetSearch);

  // Enter = 검색
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applySearch();
    }
    // ESC = 초기화
    if (e.key === "Escape") {
      e.preventDefault();
      resetSearch();
    }
  });
})();