const express = require("express"); 
const path = require("path"); 
const routes = express.Router();


const ROOT = __dirname; // mobile 폴더
const PAGES_DIR = path.join(ROOT, "pages");
// const random = require();
// const sms = require();

routes.use(express.static(ROOT));

routes.get("/", (req, res) => {
  //console.log("PAGES_DIR:", PAGES_DIR);
  //console.log("files:", fs.readdirSync(PAGES_DIR));
  return res.sendFile("find.html", { root: PAGES_DIR });
});
// ✅ 2) 그 다음에 정적 파일 (style.css 등)
routes.use("/", express.static(PAGES_DIR));

routes.post("/",(req,res)=>{
    const {userid , phonenumber} = req.body;
    
});

module.exports = routes;