export const API = {
  // 1️⃣ 월드 검색
  async worldSearch(keyword) {
    const res = await fetch("/world/station/ticket/worldsearch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ worldkeyword: keyword }),
    });

    if (!res.ok) {
      throw new Error("HTTP_" + res.status);
    }

    const data = await res.json();
    console.log("[API] worldSearch:", data);

    return data;
  },

  // 2️⃣ 월드 선택 → 역 목록 조회
  async stationList(worldId) {
    const res = await fetch("/world/station/ticket/stationlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ worldId }),
    });

    if (!res.ok) {
      throw new Error("HTTP_" + res.status);
    }

    const data = await res.json();
    console.log("[API] stationList:", data);

    return data;
  },

  // 3️⃣ 역 선택 → 티켓 요금 조회
  async ticketSearch(payload) {
    const res = await fetch("/world/station/ticket/ticketsearch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 로그인 쿠키 유지 필요하면
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("HTTP_" + res.status);
    }

    const data = await res.json();
    console.log("[API] ticketSearch:", data);

    return data;
  },
};
