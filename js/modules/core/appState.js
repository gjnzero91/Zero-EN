// Zero-EN/js/modules/core/appState.js
// Quản lý trạng thái ứng dụng Zero-EN (Supabase version)

import { saveUserDataToSupabase, loadUserDataFromSupabase } from "../data/dataService.js";
import { getCurrentUser } from "../auth/authService.js";

export const appState = {
  'a1-b1': { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 10, countdownActive: false },
  'b2-c2': { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 10, countdownActive: false },
  'star':  { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 10, countdownActive: false }
};

export const getBookState = (key) => appState[key];

export const setBookStateProperty = (key, prop, value) => {
  appState[key][prop] = value;
};

/* ===== Local save ===== */
export function saveLocalState() {
  localStorage.setItem("bookState", JSON.stringify(appState));
}

export function loadLocalState() {
  const saved = localStorage.getItem("bookState");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(appState, parsed);
    } catch (e) {
      console.error("[AppState] Lỗi parse local state:", e);
    }
  }
}

/* ===== Supabase sync ===== */
export async function saveRemoteState() {
  const user = getCurrentUser();
  if (!user) return;
  await saveUserDataToSupabase(user.id, appState);
}

export async function loadRemoteState() {
  const user = getCurrentUser();
  if (!user) return;
  const remote = await loadUserDataFromSupabase(user.id);
  if (remote) {
    Object.assign(appState, remote);
    saveLocalState(); // đồng bộ vào localStorage luôn
  }
}
