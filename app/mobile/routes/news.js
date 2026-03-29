var request = require('request');
const express = require("express");
const routes = express.Router();


var client_id = '8Byd98ouTviC7YTTVyA2';
var client_secret = 'SUGPv4nLlM';

function fetchNaverNews(query, options = {}) {
  return new Promise((resolve, reject) => {
    var display = options.display || 10;
    var start = options.start || 1;
    var sort = options.sort || 'date';

    var api_url =
      'https://openapi.naver.com/v1/search/news.json'
      + '?query=' + encodeURIComponent(query)
      + '&display=' + display
      + '&start=' + start
      + '&sort=' + sort;

    request.get({
      url: api_url,
      headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret
      }
    }, function (error, response, body) {
      if (!error && response && response.statusCode === 200) {
        const data = JSON.parse(body);

        // ✅ 여기서 "함수 안에서" 데이터 확인
        //console.log('📦 fetchNaverNews 내부 데이터');
        //console.log(data.items[0]); // 첫 뉴스 하나만 찍어보기

        resolve(data); // 라우터로 반환
      } else {
        console.log('❌ 네이버 API 실패');
        reject(error || response.statusCode);
      }
    });
  });
}


routes.post('/search/naver', async (req, res) => {
  try {
    let data = await fetchNaverNews(req.body.query);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '네이버 뉴스 조회 실패' });
  }
});


// ✅ 사용 예시


module.exports = routes;
