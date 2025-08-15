// Zero-EN/js/modules/core/localStorage.js
// Quản lý lưu trữ trạng thái ứng dụng vào localStorage.

import { appState } from "./appState.js";
import { saveUserAppStateToSupabase, loadUserAppStateFromSupabase } from "../data/dataService.js";

// Load từ localStorage trước
export function loadLocalState() {
  const raw = localStorage.getItem("appState");
  if (raw) {
    try {
      const savedState = JSON.parse(raw);
      Object.assign(appState, savedState);
      for (const bookKey in appState) {
        if (appState.hasOwnProperty(bookKey)) {
          appState[bookKey].countdownActive = false;
        }
      }
    } catch (e) {
      console.error("Lỗi khi parse appState từ localStorage:", e);
    }
  }
}

// Lưu cả localStorage và Supabase
export async function saveLocalState(userId = null) {
  localStorage.setItem("appState", JSON.stringify(appState));
  if (userId) {
    await saveUserAppStateToSupabase(userId, appState);
  }
}

// Load từ Supabase và cập nhật localStorage
export async function syncFromSupabase(userId) {
  const remoteState = await loadUserAppStateFromSupabase(userId);
  if (remoteState) {
    Object.assign(appState, remoteState);
    saveLocalState(); // cập nhật lại localStorage
  }
}
