const express = require("express"); 
const path = require("path"); 
const fs = require("fs");
const routes = express.Router();

const database = path.join("D:", "database");
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const PAGES_DIR = path.join(ROOT, "pages");
const imgDB = path.join(database, "image");
const TEMPLATE_PATH = path.join(PAGES_DIR, "tamplate", "index.html");

routes.use("/pages", express.static(path.join(__dirname, "pages")));

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

  res.set("Content-Type", "text/html; charset=utf-8");
  console.log(__dirname);
  res.send(out);
}
// ✅ 페이지별 “HTML + CSS + JS” 매핑
const PAGE_MAP = {
  "/": {
    html: path.join(PAGES_DIR, "main", "index.html"),
    css: [
      "/softoasis/pages/main/style/main.css"
    ],
    js: [
      "/softoasis/pages/main/script/main.js"
    ],
    img: []
  },
  "/mypage": {
    html: path.join(PAGES_DIR, "mypage", "index.html"),
    css: [],
    js: [],
    img: []
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

module.exports = routes;
