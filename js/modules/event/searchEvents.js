// Zero-EN/js/modules/event/searchEvents.js
// Xử lý sự kiện tìm kiếm trong ứng dụng Zero-EN

import { getElement, redirectTo } from "../core/domHelpers.js";
import { getBookState } from "../core/appState.js";
import { setupSearchDialog } from "../ui/dialogUI.js";

// Danh sách các trang từ vựng và key tương ứng
// Cần được định nghĩa hoặc import từ một module chung nếu được sử dụng ở nhiều nơi
const bookPages = [
  { key: "a1-b1", page: "a1-b1.html" },
  { key: "b2-c2", page: "b2-c2.html" },
  { key: "star", page: "star.html" }
];

// Hàm tìm kiếm từ trong tất cả các danh mục từ vựng đã tải
function findWordInBooks(searchWord) {
  searchWord = searchWord.trim().toLowerCase();
  for (const { key, page } of bookPages) {
    const state = getBookState(key);
    if (!state || !state.words) continue;
    const idx = state.words.findIndex(w => w.word.toLowerCase() === searchWord);
    if (idx !== -1) {
      return { key, page, idx };
    }
  }
  return null;
}

export function attachSearchEvent() {
  // Lấy các phần tử DOM cần thiết cho chức năng tìm kiếm
  const searchIcon = getElement("searchIcon");
  const searchDialog = getElement("searchDialog");
  const searchInput = getElement("searchInput");
  const searchBtn = getElement("searchBtn");

if (!searchIcon || !searchDialog || !searchInput || !searchBtn) {
  return;
}

  // Thiết lập hộp thoại tìm kiếm và xử lý sự kiện tìm kiếm
  setupSearchDialog(
    searchIcon,
    searchDialog,
    searchInput,
    searchBtn,
    () => {
      const word = searchInput.value;
      if (!word) return;
      const found = findWordInBooks(word);
      if (found) {
        localStorage.setItem("searchTarget", JSON.stringify({ key: found.key, idx: found.idx }));
        const wordDisplay = document.getElementById("wordDisplay");
        if (wordDisplay) wordDisplay.textContent = "Loading...";
        redirectTo(found.page);
      } else {
        alert("Not found in any vocabulary list.");
      }
      searchDialog.classList.add("hidden");
    }
  );
}