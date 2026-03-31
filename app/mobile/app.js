const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();



// 폴더 기준
const ROOT = __dirname; // mobile 폴더
// 네 환경 그대로
const database = path.join("D:", "database");
const PAGES_DIR = path.join(ROOT, "pages");
const imgDB= path.join(database, "image");
const TEMPLATE_PATH = path.join(PAGES_DIR, "tamplate", "index.html");

const postnews = require("./routes/news");

// 정적 파일
routes.use(express.static(ROOT));
routes.use(express.static(imgDB));

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

// 검색 POST
routes.use("/news",postnews); 

function extractMainInner(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : html;
}

/**
 * pageCssHrefs: ["/mobile/pages/main/main.css", ...]
 * pageJsSrcs:   ["/mobile/pages/main/main.js", ...]  // 필요하면 사용
 */
function renderWithTemplate(res, pageFileAbsPath, pageCssHrefs = [], pageJsSrcs = []) {
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  let pageHtml = fs.readFileSync(pageFileAbsPath, "utf8");
  pageHtml = extractMainInner(pageHtml);

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
  res.send(out);
}

// ✅ 페이지별 “HTML + CSS + JS” 매핑
const PAGE_MAP = {
  "/": {
    html: path.join(PAGES_DIR, "main", "main.html"),
    css: [
      "/mobile/pages/main/style/main.css",
      "/mobile/pages/main/style/news.css",
      "/mobile/pages/main/style/introdevice.css",
      "/mobile/pages/main/style/telecomlist.css"
    ],
    js: ["/mobile/pages/main/script/news.js"],
    img : [
    ]
  },

  "/handphone": {
    html: path.join(PAGES_DIR, "handphone", "handphone.html"),
    css: ["/mobile/pages/handphone/style/handphone.css"],
    js: ["/mobile/pages/handphone/script/dataapi.js"]
  },

  "/tablet": {
    html: path.join(PAGES_DIR, "handphone", "handphone.html"),
    css: ["/mobile/pages/handphone/style/handphone.css"],
    js: ["/mobile/pages/handphone/script/dataapi.js"]
  },

  "/notebook": {
    html: path.join(PAGES_DIR, "handphone", "handphone.html"),
    css: ["/mobile/pages/handphone/style/handphone.css"],
    js: ["/mobile/pages/handphone/script/dataapi.js"]
  },

  "/peripheral": {
    html: path.join(PAGES_DIR, "handphone", "handphone.html"),
    css: ["/mobile/pages/handphone/style/handphone.css"],
    js: ["/mobile/pages/handphone/script/dataapi.js"]
  },

  "/accessory": {
    html: path.join(PAGES_DIR, "handphone", "handphone.html"),
    css: ["/mobile/pages/handphone/style/handphone.css"],
    js: ["/mobile/pages/handphone/script/dataapi.js"]
  },

  "/case": {
    html: path.join(PAGES_DIR, "handphone", "handphone.html"),
    css: ["/mobile/pages/handphone/style/handphone.css"],
    js: ["/mobile/pages/handphone/script/dataapi.js"]
  },

  "/kart": {
    html: path.join(PAGES_DIR, "kart", "index.html"),
    css: ["/mobile/pages/handphone/style/handphone.css"],
    js: ["/mobile/pages/handphone/script/handphone.css"]
  }
};

Object.keys(PAGE_MAP).forEach((routePath) => {
  routes.get(routePath, (req, res) => {
    const conf = PAGE_MAP[routePath];

    if (!fs.existsSync(conf.html)) {
      return res.status(404).send("페이지 파일을 찾을 수 없습니다: " + conf.html);
    }

    renderWithTemplate(res, conf.html, conf.css, conf.js);
  });
});



module.exports = routes;
