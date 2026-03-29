import { DOM } from "./dom.js";
import { UI } from "./ui.js";
import { State } from "./state.js";
import { Handlers } from "./handlers.js";

function bindEvents() {
  DOM.worldSearchBtn?.addEventListener("click", Handlers.onWorldSearch);
  DOM.worldKeyword?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") Handlers.onWorldSearch();
  });

  DOM.stationSelect?.addEventListener("change", (e) =>
    Handlers.onStationChange(e)   // value 말고 event 넘겨
  );

  DOM.minusBtn?.addEventListener("click", () => UI.setQty(State.data.qty - 1));
  DOM.plusBtn?.addEventListener("click", () => UI.setQty(State.data.qty + 1));

  DOM.resetBtn?.addEventListener("click", Handlers.onReset);
  DOM.nextBtn?.addEventListener("click", Handlers.onNext);
}



function init() {
  bindEvents();
  UI.setQty(1);
  UI.resetStations("월드를 검색해 주세요");
  UI.validate();
}

init();