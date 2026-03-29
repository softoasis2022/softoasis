const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = express.Router();

const ROOT = __dirname; // mobile 폴더
const database = path.join("D:", "database");
const PAGES_DIR = path.join(ROOT, "pages");
const TEMPLATE_PATH = path.join(PAGES_DIR, "tamplate", "index.html");

routes.use(express.static(ROOT));

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

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
        html: path.join(PAGES_DIR, "deviceprofile", "index.html"),
        css: [
            "/deviceprofile/style/viewgrid.css"
        ],
        js: [],
        img: []
    },
    "/deviceprofile": {
        html: path.join(PAGES_DIR, "deviceprofile", "index.html"),
        css: [
            "./pages/deviceprofile/style/index.css"
        ],
        js: [
            "./pages/deviceprofile/script/list1.js",
            "./pages/deviceprofile/script/search.js"
        ],
        img: []
    },
    "/deviceedit": {
        html: path.join(PAGES_DIR, "devicepofileedit", "index.html"),
        css: [],
        js: [],
        img: []
    }
};

Object.keys(PAGE_MAP).forEach((routePath) => {
    routes.get(routePath, (req, res) => {
        const conf = PAGE_MAP[routePath];

        if (!fs.existsSync(conf.html)) {
            return res.status(404).send("페이지 파일을 찾을 수 없습니다: " + conf.html);
        }

        renderWithTemplate(res, conf.html, conf.css, conf.js);
        console.log(__dirname);
    });
});



// POST 요청 처리 예시
routes.post('/devicelist', (req, res) => {
    const body = req.body;   // 요청의 JSON 데이터
    console.log(body);

    fs.readFileSync(path.join(database, "mobile", "deviceprofile", ""))

    res.json({
        message: 'JSON 요청 잘 받았습니다!',
        received: body
    });
});

routes.post('/deviceinfo', (req, res) => {
    const body = req.body;   // 요청의 JSON 데이터
    //디바이스 모델 번호로 요청 받은 데이터는 디비에서 해당 보델번호로 데이터 읽어옴
    console.log(body);



    res.json({
        message: 'JSON 요청 잘 받았습니다!',
        received: body
    });
});

routes.post('/deviceedit', (req, res) => {
    // 요청 데이터
    const body = req.body;
    console.log(body);


    // body.brand, body.modelcode 등 사용
    const brand = body.brand;
    const modelcode = body.modelcode;
    const storage = body.storage;

    // 저장할 경로 생성
    const savePath = path.join(
        database,
        "mobile",
        "deviceprofile",
        brand,
        `${modelcode}.json`
    );

    // 디렉토리 생성 (없으면 자동 생성)
    fs.mkdirSync(path.dirname(savePath), { recursive: true });

    // 요청 데이터를 JSON 파일로 저장
    fs.writeFileSync(savePath, JSON.stringify(body, null, 2), 'utf-8');

    res.redirect("/admin/mobile/deviceedit");
});





module.exports = routes;