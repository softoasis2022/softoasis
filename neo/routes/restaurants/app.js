const axios = require("axios");
const cheerio = require("cheerio");


const restaurants ={
    "네이버" : "https:///www.naver.com",
    "다이닝코드" : "https://www.diningcode.com",
    "인스타" : "https://www.instagram.com"
}

function restaurantsfind(website="네이버"){
    let url  = restaurants[website];
    console.log(url);
}


async function crawl() {
  try {
    const url = "https:///www.naver.com";

    // 1. 페이지 가져오기
    const response = await axios.get(url);

    // 2. HTML 파싱
    const $ = cheerio.load(response.data);

    // 3. 원하는 데이터 찾기
    $("a").each((i, el) => {
      const text = $(el).text();
      const link = $(el).attr("href");

      console.log(text, link);
    });

  } catch (err) {
    console.error(err);
  }
}