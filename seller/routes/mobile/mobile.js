const express = require("express");
const path = require("path");
const routes = express.Router();
const fs = require("fs");
const database = path.join("D:", "database");
routes.use(express.urlencoded({ extended: true }));
routes.use(express.json());


//
// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const PAGES_DIR = path.join(ROOT, "pages");
const imgDB = path.join(database, "image");
const TEMPLATE_PATH = path.join(PAGES_DIR, "tamplate", "index.html");

// 정적 파일
routes.use(express.static(ROOT));
routes.use(express.static(imgDB));

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

function extractMainInner(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[0] : html;
}
/**
 * pageCssHrefs: ["/mobile/pages/main/main.css", ...]
 * pageJsSrcs:   ["/mobile/pages/main/main.js", ...]  // 필요하면 사용
 */
function renderWithTemplate(res, pageFileAbsPath, pageCssHrefs = [], pageJsSrcs = []) {
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  let pageHtml = fs.readFileSync(pageFileAbsPath, "utf8");
  pageHtml = extractMainInner(pageHtml); // ✅ main 전체 유지

  const cssTags = (pageCssHrefs || [])
    .filter(Boolean)
    .map((href) => `<link rel="stylesheet" href="${href}">`)
    .join("\n");

  const jsTags = (pageJsSrcs || [])
    .filter(Boolean)
    .map((src) => `<script src="${src}" defer></script>`)
    .join("\n");

  // 템플릿에 자리 없으면(까먹었을 때) 최소한 main은 주입되게 안전 처리
  let out = template.replace("<!-- MAIN_CONTENT -->", pageHtml);

  // head에 페이지별 CSS 주입
  if (out.includes("<!-- PAGE_STYLE -->")) {
    out = out.replace("<!-- PAGE_STYLE -->", cssTags);
  } else {
    // fallback: </head> 바로 앞에 삽입
    out = out.replace("</head>", `${cssTags}\n</head>`);
  }

  // body 끝에 페이지별 JS 주입 (필요할 때만)
  if (jsTags) {
    out = out.replace("</body>", `${jsTags}\n</body>`);
  }


  if (jsTags) {
    out = out.replace("</body>", `${jsTags}\n</body>`);
  }

  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(out);
}
// ✅ 페이지별 “HTML + CSS + JS” 매핑
const PAGE_MAP = {
  "/": {
    html: path.join(PAGES_DIR, "main", "index.html"),
    css: [
      "./mobile/pages/main/style/main.css"
    ],
    js: [],
    img: [
    ]
  },
  "/republish/register": {
    html: path.join(PAGES_DIR, "republish_register", "index.html"),
    css: ["/seller/mobile/pages/republish_register/style/ddd.css"],
    js: ["/seller/mobile/pages/republish_register/script/ssss.js"]
  }

};

Object.keys(PAGE_MAP).forEach((routePath) => {
  routes.get(routePath, (req, res) => {
    const conf = PAGE_MAP[routePath];
    console.log(ROOT);
    if (!fs.existsSync(conf.html)) {
      return res.status(404).send("페이지 파일을 찾을 수 없습니다: " + conf.html);
    }

    renderWithTemplate(res, conf.html, conf.css, conf.js);
  });
});
//



routes.post("/republish/register/:sellernumber",(req,res)=>{
  const data  = req.body;

  //쿠키에 sellerid 확인하고 확인된 

  // {
  //   items: [
  //     {
  //       manufacturer: 'btrsb',
  //       series: 'bhsrb',
  //       model_code: 'bhstb',
  //       model_name: 'bsthb',
  //       price: 130000,
  //       grades: [Array]
  //     }
  //   ]
  // }
  console.log(data);
  //데이터 베이스에 저장 투트는 
  res.json({
    message : "완료"
  });
});









module.exports = routes;