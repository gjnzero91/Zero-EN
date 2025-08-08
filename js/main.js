// js/main.js
// Điểm vào cho ứng dụng Zero-EN

import { setBookStateProperty } from "./modules/core/appState.js";
import { fetchWordsFromCsv } from "./modules/data/dataService.js";
import { initPage } from "./modules/page/pageInit.js";
import { attachSearchEvent } from "./modules/event/searchEvents.js";
import { observeAuthState } from "./modules/auth/authService.js";
import { setGreeting } from "./modules/auth/authUI.js";
import { redirectTo } from "./modules/core/domHelpers.js";

// Nguồn dữ liệu
const bookSources = {
  "a1-b1": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=0&single=true&output=csv",
  "b2-c2": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=2053150601&single=true&output=csv"
};

// Tải dữ liệu từ CSV
async function ensureAllBookDataLoaded() {
  for (const key of Object.keys(bookSources)) {
    let words = [];
    const localKey = `vocabWords_${key}`;
    const cached = localStorage.getItem(localKey);
    if (cached) {
      try {
        words = JSON.parse(cached);
      } catch (e) {
        console.error("Lỗi khi parse localStorage:", e);
        words = [];
      }
    }

    if (!words || words.length === 0) {
      console.log(`📥 Đang tải từ vựng cho ${key}...`);
      words = await fetchWordsFromCsv(bookSources[key]);
      if (words.length > 0) {
        localStorage.setItem(localKey, JSON.stringify(words));
        console.log(`✅ Đã lưu ${words.length} từ cho ${key}`);
      }
    } else {
      console.log(`✅ Đã load từ localStorage: ${words.length} từ cho ${key}`);
    }

    setBookStateProperty(key, "words", words);
  }
}

// Đăng ký DOM Loaded
window.addEventListener("DOMContentLoaded", () => {
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => window.location.href = "home.html");
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (typeof signOutUser === "function") {
        await signOutUser();
      }
      window.location.href = "login.html";
    });
  }

  // Kiểm tra xác thực người dùng trước khi hiển thị trang
  observeAuthState(async (user) => {
    if (user) {
      setGreeting(user.email.split("@")[0]);
      const pageName = window.location.pathname.split("/").pop();
      initPage(pageName);
      await ensureAllBookDataLoaded();
      attachSearchEvent();
    } else {
      redirectTo("login.html");
    }
  });
});
