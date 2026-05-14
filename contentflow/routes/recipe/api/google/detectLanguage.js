const express = require("express");
const path = require("path");
const routes = express.Router();
const database = path.join("D:", "database")
const fs = require("fs");

// app/recipe/api/google/detectLanguage.js
const { GoogleAuth } = require("google-auth-library");

const PROJECT_ID = "coffeemania-8a4ba";

async function detectLanguage(content) {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-translation"],
    quotaProjectId: PROJECT_ID,
  });

  const client = await auth.getClient();

  // google-auth-library 버전 차이 대응
  const access = await client.getAccessToken();
  const token = typeof access === "string" ? access : access?.token;

  if (!token) {
    throw new Error("Access token 발급 실패");
  }

  const url = `https://translation.googleapis.com/v3/projects/${PROJECT_ID}/locations/global:detectLanguage`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-goog-user-project": PROJECT_ID, // 🔥 quota project 명시
    },
    body: JSON.stringify({ content }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}

// ✅ 서버에서 사용할 수 있도록 export
module.exports = { detectLanguage };

// ✅ 단독 실행 테스트 (require로 불러오면 실행 안 됨)
if (require.main === module) {
  (async () => {
    try {
      const result = await detectLanguage("하이!");
      console.log(result);
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  })();
}
