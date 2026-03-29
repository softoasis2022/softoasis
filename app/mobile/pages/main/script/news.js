document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  try {
    const data = await fetchData("KT"); // ✅ 테스트용 검색어
    renderLayout(data);                   // 또는 renderLayout(data.items)
  } catch (err) {
    console.error("초기화 실패:", err);
  }
}

async function fetchData(query) {
  const res = await fetch('/mobile/news/search/naver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error('데이터 로드 실패');

  const data = await res.json();   // ✅ JSON으로 읽기
  console.log(data);               // ✅ 여기서 확인
  return data;                     // ✅ 반드시 반환
}

function renderLayout(newsdata) {
  const framelayout = document.getElementById('newslist');
  if (!framelayout) return;

  // items 배열 꺼내기
  const items = (newsdata && Array.isArray(newsdata.items)) ? newsdata.items : [];

  // 초기화
  framelayout.innerHTML = '';

  // 데이터 없을 때
  if (items.length === 0) {
    const li = document.createElement('li');
    li.textContent = '검색 결과가 없습니다.';
    framelayout.appendChild(li);
    return;
  }

  // 날짜 보기 좋게 변환
  const formatDate = (pubDate) => {
    const d = new Date(pubDate);
    if (isNaN(d.getTime())) return pubDate || '';
    return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'news-item';

    // 링크 (네이버 link 우선, 없으면 originallink)
    const url = item.link || item.originallink || '#';

    // title/description에 <b>가 섞여 있어서 innerHTML 사용
    const titleHTML = item.title || '(제목 없음)';
    const descHTML = item.description || '';

    li.innerHTML = `
      <a class="news-title" href="${url}" target="_blank" rel="noopener noreferrer">
        <p>${titleHTML}</p>
        <div class="news-desc">${descHTML}</div>
        <div class="news-meta">
          <span class="news-date">${formatDate(item.pubDate)}</span>
        </div>
      </a>
      
    `;

    framelayout.appendChild(li);
  });
}