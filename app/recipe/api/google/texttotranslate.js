const express = require("express");
const path = require("path");
const routes = express.Router();
const database = path.join("D:", "database")
const fs = require("fs");

// app/recipe/api/google/translateText_rest.js
const { GoogleAuth } = require("google-auth-library");

const PROJECT_ID = "coffeemania-8a4ba";
const LOCATION = "global";

async function translateText({
  text,
  sourceLanguageCode = "ko",
  targetLanguageCode = "en",
  mimeType = "text/plain",
}) {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-translation"],
    quotaProjectId: PROJECT_ID,
  });

  const client = await auth.getClient();

  const access = await client.getAccessToken();
  const token = typeof access === "string" ? access : access?.token;
  if (!token) throw new Error("Access token 발급 실패");

  const url = `https://translation.googleapis.com/v3/projects/${PROJECT_ID}/locations/${LOCATION}:translateText`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-goog-user-project": PROJECT_ID,
    },
    body: JSON.stringify({
      contents: [text],
      mimeType,
      sourceLanguageCode,
      targetLanguageCode,
    }),
  });

  const bodyText = await res.text();
  if (!res.ok) throw new Error(bodyText);

  return JSON.parse(bodyText);
}

module.exports = { translateText };

// 단독 실행 테스트(서버에선 실행 안 됨)
if (require.main === module) {
  (async () => {
    try {
      const result = await translateText({ text: "pasta", sourceLanguageCode: "ko", targetLanguageCode: "en" });
      console.log(result.translations?.[0]?.translatedText);
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  })();
}
