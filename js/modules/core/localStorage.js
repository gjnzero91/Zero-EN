// Zero-EN/js/modules/core/localStorage.js
// Quản lý lưu trữ trạng thái ứng dụng vào localStorage.

// Zero-EN/js/modules/core/localStorage.js
import { appState } from "./appState.js";

export function loadLocalState() {
  const raw = localStorage.getItem("appState");
  if (raw) {
    try {
      const savedState = JSON.parse(raw);
      Object.assign(appState, savedState); // ← Cập nhật appState toàn cục
    } catch (e) {
      console.error("❌ Lỗi khi parse appState từ localStorage:", e);
    }
  }
}

export function saveLocalState() {
  localStorage.setItem("appState", JSON.stringify(appState));
}

