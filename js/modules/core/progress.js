// js/modules/core/progress.js
import { appState } from "./appState.js";

const STORAGE_KEY = "word-progress";

export function saveProgress() {
  const data = {
    page: appState.page,
    index: appState.index,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadProgress(page) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (data.page === page && typeof data.index === "number") {
      return data.index;
    }
  } catch (e) {
    console.error("Failed to load progress", e);
  }
  return null;
}
