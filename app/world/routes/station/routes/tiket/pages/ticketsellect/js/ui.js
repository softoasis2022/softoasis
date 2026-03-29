import { DOM } from "./dom.js";
import { Util } from "./utils.js";
import { State } from "./state.js";

export const UI = {
  setGuide(text) {
    if (DOM.guide) DOM.guide.textContent = text;
  },

  updatePrice() {
    const s = State.data;

    if (!s.stationId) {
      DOM.basePrice.textContent = "-";
      DOM.feePrice.textContent = "-";
      DOM.totalPrice.textContent = "-";
      return;
    }

    DOM.basePrice.textContent = Util.fmtWon(s.unitBase);
    DOM.feePrice.textContent = Util.fmtWon(s.unitFee);

    const total = (s.unitBase + s.unitFee) * s.qty;
    DOM.totalPrice.textContent = Util.fmtWon(total);
  },

  setQty(n) {
    const min = 1, max = 10;
    State.data.qty = Util.clamp(n, min, max);

    DOM.qtyVal.textContent = String(State.data.qty);
    DOM.minusBtn.disabled = State.data.qty <= min;
    DOM.plusBtn.disabled = State.data.qty >= max;

    UI.updatePrice();
    UI.validate();
  },

  validate() {
    const s = State.data;
    const ok = !!s.worldId && !!s.stationId && s.qty >= 1;

    DOM.nextBtn.disabled = !ok;
    UI.setGuide(
      ok
        ? "준비 완료! 다음 화면에서 각 티켓의 사용방식(개인/선물)을 지정합니다."
        : "월드를 검색하고 역을 선택하면 “다음” 버튼이 활성화됩니다."
    );
  },

  resetStations(message) {
    DOM.stationSelect.disabled = true;
    DOM.stationSelect.innerHTML = `<option value="">${message}</option>`;

    State.resetStationSelection();
    State.data.stations = [];

    UI.updatePrice();
    UI.validate();
  },

  fillWorldList(worldlist) {
    // worldlist: [{ worldname, worldnumber, worldimg, worldintro }, ...]

    DOM.stationSelect.disabled = false;
    DOM.stationSelect.innerHTML = `<option value="">월드를 선택하세요</option>`;

    worldlist.forEach((w) => {
      const opt = document.createElement("option");
      opt.value = w.worldnumber;          // ✅ value는 고유번호
      opt.textContent = w.worldname;      // ✅ 화면 표시 텍스트

      // 필요하면 추가정보도 붙여둘 수 있음
      opt.dataset.worldimg = w.worldimg || "";
      opt.dataset.worldintro = w.worldintro || "";

      DOM.stationSelect.appendChild(opt);
    });

    UI.validate();
  }
};
