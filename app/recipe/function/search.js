//서브 플렛폼(레시피)에서의 검색 기능
// routes/detectLanguage.js
const express = require("express");
const router = express.Router();
const { detectLanguage } = require("../recipe/api/google/detectLanguage");

// router.post("/detect-language", async (req, res) => {
//   try {
//     const { content } = req.body;
//     if (!content) {
//       return res.status(400).json({ ok: false, error: "content is required" });
//     }

//     const data = await detectLanguage(content);
//     res.json({ ok: true, data });
//   } catch (e) {
//     res.status(500).json({ ok: false, error: String(e) });
//   }
// });

function Search(){
}

module.exports = {Search};
