document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  try {
    const data = await fetchData("LG유플러스"); 
    renderLayout(data);
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

  const data = await res.json();
  return data;
}

function renderLayout(newsdata) {
  const framelayout = document.getElementById('newslist');
  if (!framelayout) return;

  const items = (newsdata && Array.isArray(newsdata.items)) ? newsdata.items : [];
  framelayout.innerHTML = '';

  if (items.length === 0) {
    const li = document.createElement('li');
    li.textContent = '검색 결과가 없습니다.';
    framelayout.appendChild(li);
    return;
  }

  const formatDate = (pubDate) => {
    const d = new Date(pubDate);
    if (isNaN(d.getTime())) return pubDate || '';
    return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  items.forEach((item) => {
    const url = item.link || item.originallink || '#';

    // <a> 생성
    const a = document.createElement('a');
    a.className = 'news-title';
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    // <li> 생성
    const li = document.createElement('li');
    li.className = 'news-item';

    li.innerHTML = `
        <p>${item.title || '(제목 없음)'}</p>
        <div class="news-desc">${item.description || ''}</div>
        <div class="news-meta">
            <span class="news-date">${formatDate(item.pubDate)}</span>
        </div>
    `;

    // <a> → <li> 포함시키기
    a.appendChild(li);

    // 최종적으로 <ul>에 넣기
    framelayout.appendChild(a);
  });
}