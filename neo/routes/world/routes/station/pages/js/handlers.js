import { DOM } from "./dom.js";
import { State } from "./state.js";
import { UI } from "./ui.js";
import { API } from "./api.js";

export const Handlers = {
  async onWorldSearch() {
    const keyword = (DOM.worldKeyword?.value || "").trim();

    // 초기화
    State.data.worldId = "";
    State.data.worldName = keyword;
    State.data.stationId = "";
    State.data.unitBase = 0;
    State.data.unitFee = 0;

    // ✅ 셀렉 모드: 월드 선택 단계
    State.data.selectMode = "world";

    UI.resetStations("검색 중...");

    if (!keyword) {
      UI.resetStations("월드 이름을 입력하세요");
      return;
    }

    try {
      const data = await API.worldSearch(keyword);
      const worldlist = data?.world?.worldlist || [];

      if (!Array.isArray(worldlist) || worldlist.length === 0) {
        UI.resetStations("검색 결과가 없습니다");
        return;
      }

      // 월드 캐시
      State.data.worldlist = worldlist;

      // 셀렉에 월드 채우기
      DOM.stationSelect.disabled = false;
      DOM.stationSelect.innerHTML = `<option value="">월드를 선택하세요</option>`;

      worldlist.forEach((w) => {
        const opt = document.createElement("option");
        opt.value = w.worldnumber;      // 월드번호
        opt.textContent = w.worldname;  // 월드명
        DOM.stationSelect.appendChild(opt);
      });

      UI.updatePrice();
      UI.validate();
      UI.setGuide("월드를 선택하면 해당 월드의 역 목록을 불러옵니다.");
    } catch (e) {
      UI.resetStations(e?.status ? `검색 실패 (${e.status})` : "서버 통신 오류");
    }
  },

  // ✅ stationSelect 하나로 월드/역 선택을 모두 처리
  async onStationChange(value) {
    if (!value) return;

    // 모드 기본값 방어
    const mode = State.data.selectMode || "world";

    // =========================
    // 1) 월드 선택 단계
    // =========================
    if (mode === "world") {
      const worldId = value;
      State.data.worldId = worldId;
      State.data.stationId = "";
      State.data.unitBase = 0;
      State.data.unitFee = 0;

      UI.updatePrice();
      UI.validate();
      UI.resetStations("역 불러오는 중..."); // 같은 셀렉 재사용하므로 안내

      try {
        // ✅ 월드 선택 후 역 목록 불러오기 API가 필요
        // 예: API.stationList(worldId)
        const data = await API.stationList(worldId);
        const stations = data?.stations || data?.stationlist || [];

        if (!Array.isArray(stations) || stations.length === 0) {
          UI.resetStations("해당 월드에 역이 없습니다");
          return;
        }

        State.data.stations = stations;

        // ✅ 이제부터 셀렉은 역 선택 모드로 전환
        State.data.selectMode = "station";

        DOM.stationSelect.disabled = false;
        DOM.stationSelect.innerHTML = `<option value="">역을 선택하세요</option>`;

        stations.forEach((s) => {
          const opt = document.createElement("option");
          opt.value = s.stationId || s.stationnumber || s.id;     // 너 DB키에 맞게 하나로 통일 추천
          opt.textContent = s.stationName || s.stationname || s.name;
          // worldId는 이미 State에 있으니 굳이 dataset 안 넣어도 됨
          DOM.stationSelect.appendChild(opt);
        });

        UI.setGuide("역을 선택하면 요금 정보를 불러옵니다.");
        UI.validate();
      } catch (e) {
        UI.resetStations(e?.status ? `역 불러오기 실패 (${e.status})` : "서버 통신 오류");
      }

      return;
    }

    // =========================
    // 2) 역 선택 단계 (ticketsearch POST)
    // =========================
    if (mode === "station") {
      const stationId = value;
      const worldId = State.data.worldId;

      State.data.stationId = stationId;

      try {
        // ✅ 네가 원한 ticketsearch POST
        const result = await API.ticketSearch({ worldId, stationId });

        if (!result?.success) {
          alert("티켓 정보를 불러오지 못했습니다.");
          return;
        }

        // 서버 응답 키 이름에 맞춰 저장
        State.data.unitBase = Number(result.basePrice ?? result.unitBase ?? 0);
        State.data.unitFee = Number(result.feePrice ?? result.unitFee ?? 0);

        UI.updatePrice();
        UI.validate();
        UI.setGuide("수량을 조절한 뒤 다음으로 진행하세요.");
      } catch (e) {
        console.error("티켓 조회 실패:", e);
        alert("티켓 조회 실패");
      }

      return;
    }
  },

  onReset() {
    State.resetAll();
    if (DOM.worldKeyword) DOM.worldKeyword.value = "";

    // 모드 초기화
    State.data.selectMode = "world";

    UI.setQty(1);
    UI.resetStations("월드를 검색해 주세요");
  },

  onNext() {
    const s = State.data;

    const payload = {
      worldId: s.worldId,
      worldName: s.worldName,
      stationId: s.stationId,
      qty: s.qty,
      unitPrice: s.unitBase + s.unitFee,
      unitBase: s.unitBase,
      unitFee: s.unitFee,
      totalPrice: (s.unitBase + s.unitFee) * s.qty,
    };

    localStorage.setItem("SO_TICKET_BUY", JSON.stringify(payload));
    location.href = "ticket_use.html";
  },
};
