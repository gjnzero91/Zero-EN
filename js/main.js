// js/main.js
// Điểm vào cho ứng dụng Zero-EN

// Import các hàm cần thiết từ các module khác
import { getBookState, setBookStateProperty } from "./modules/core/appState.js";
import { fetchWordsFromCsv } from "./modules/data/dataService.js";
import { initPage } from "./modules/page/pageInit.js";
import { attachSearchEvent } from "./modules/event/searchEvents.js";

// Định nghĩa các nguồn dữ liệu CSV cho từng loại từ vựng
const bookSources = {
  "a1-b1": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=0&single=true&output=csv",
  "b2-c2": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=2053150601&single=true&output=csv"
};

// Hàm đảm bảo tất cả dữ liệu từ vựng từ CSV đã được tải vào bộ nhớ đệm ứng dụng
async function ensureAllBookDataLoaded() {
  for (const key of Object.keys(bookSources)) {
    let words = [];
    const localKey = `vocabWords_${key}`;
    const cached = localStorage.getItem(localKey);
    if (cached) {
      try {
        words = JSON.parse(cached);
      } catch (e) {
        console.error("Lỗi khi phân tích dữ liệu từ vựng từ localStorage:", e);
        words = [];
      }
    }
    if (!words || words.length === 0) {
      console.log(`Đang tải từ vựng cho ${key} từ CSV...`);
      words = await fetchWordsFromCsv(bookSources[key]);
      if (words && words.length > 0) {
        localStorage.setItem(localKey, JSON.stringify(words));
        console.log(`Đã tải và lưu ${words.length} từ cho ${key}.`);
      } else {
        console.warn(`Không tải được từ vựng cho ${key}.`);
      }
    } else {
      console.log(`Đã tải ${words.length} từ cho ${key} từ localStorage.`);
    }
    setBookStateProperty(key, "words", words);
  }
}

// Lắng nghe sự kiện khi DOM đã tải xong
window.addEventListener("DOMContentLoaded", async () => {
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
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

  // Phần khởi tạo trang và dữ liệu
  const pathSegments = window.location.pathname.split("/");
  const currentPage = pathSegments[pathSegments.length - 1] || "index.html";
  initPage(currentPage);

  await ensureAllBookDataLoaded();

  attachSearchEvent();
});
