// seller-product-batch.js

(() => {
  const root = document.querySelector('main[data-page="seller-product-batch"]');
  if (!root) return;

  const manufacturerInput = document.getElementById("manufacturer");
  const manufacturerList  = document.getElementById("manufacturerList");
  const seriesSelect      = document.getElementById("series");
  const modelNameInput    = document.getElementById("model_name");

  function debounce(fn, ms = 250) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  async function fetchJSON(url) {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  function resetSeries() {
    seriesSelect.disabled = true;
    seriesSelect.innerHTML = `<option value="">제조사 먼저 선택</option>`;
  }

  // 1) 제조사 자동완성
  const loadManufacturers = debounce(async () => {
    const q = manufacturerInput.value.trim();
    if (!q) {
      manufacturerList.innerHTML = "";
      resetSeries();
      return;
    }

    try {
      const data = await fetchJSON(`/api/brands?q=${encodeURIComponent(q)}`);
      manufacturerList.innerHTML = "";

      (data.items || []).forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        manufacturerList.appendChild(opt);
      });
    } catch (e) {
      // 조용히 실패 처리
      console.warn(e);
    }
  }, 250);

  manufacturerInput.addEventListener("input", loadManufacturers);

  // 2) 제조사 확정 -> 시리즈 로딩
  manufacturerInput.addEventListener("change", async () => {
    const brand = manufacturerInput.value.trim();
    resetSeries();
    if (!brand) return;

    try {
      const data = await fetchJSON(`/api/series?brand=${encodeURIComponent(brand)}`);

      seriesSelect.disabled = false;
      seriesSelect.innerHTML = `<option value="">시리즈 선택</option>`;

      (data.items || []).forEach((series) => {
        const opt = document.createElement("option");
        opt.value = series;
        opt.textContent = series;
        seriesSelect.appendChild(opt);
      });
    } catch (e) {
      resetSeries();
      console.warn("Unknown manufacturer or API error:", e);
    }
  });

  // 3) 시리즈 선택 -> 모델 힌트 (placeholder로 제공)
  seriesSelect.addEventListener("change", async () => {
    const brand = manufacturerInput.value.trim();
    const series = seriesSelect.value;
    if (!brand || !series) return;

    try {
      const data = await fetchJSON(
        `/api/models?brand=${encodeURIComponent(brand)}&series=${encodeURIComponent(series)}`
      );
      if (data.items?.length) {
        modelNameInput.placeholder = data.items[0]; // 첫 후보를 힌트로
      }
    } catch (e) {
      console.warn(e);
    }
  });

  // 초기
  resetSeries();
})();
