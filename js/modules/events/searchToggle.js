// js/modules/events/searchToggle.js
// Xử lý hiển thị/ẩn hộp thoại tìm kiếm và tìm từ trong danh sách hiện tại

import { appState } from "../core/appState.js";

export function searchToggle() {
  const dialog = document.getElementById("searchDialog");
  const btn = document.getElementById("searchToggle");

  if (!dialog || !btn) return;

  const isHidden = dialog.classList.toggle("hidden");

  // Update search button UI
  btn.classList.toggle("active", !isHidden);
  btn.title = isHidden ? "Open Search" : "Close Search";
}

export function setupSearchDialog() {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");

  if (!input || !btn) return;

  btn.addEventListener("click", () => {
    const term = input.value.trim().toLowerCase();
    if (!term) return;

    const index = appState.words.findIndex(
      w => w.word?.toLowerCase() === term
    );

    if (index >= 0) {
      // ✅ Điều hướng sang trang search, truyền từ khóa
      window.location.hash = `#/search?word=${encodeURIComponent(term)}`;
    } else {
      alert("Not found");
    }
  });
}
