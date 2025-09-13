// js/modules/events/nextPrev.js
// Xử lý sự kiện Next/Prev để chuyển từ trong danh sách từ hiện tại

import { appState } from "../core/appState.js";
import { renderWord } from "../ui/render.js";
import { refreshProgress } from "./progressWrapper.js";

export function next() {
  if (!appState.words.length) return;

  if (appState.index < appState.words.length - 1) {
    appState.index++;
  } else {
    appState.index = 0;
    appState.visitedCount = 1;
  }

  appState.visitedCount = Math.max(appState.visitedCount, appState.index + 1);

  renderWord();
  refreshProgress();
}

export function prev() {
  if (!appState.words.length) return;

  if (appState.index > 0) {
    appState.index--;
  } else {
    appState.index = appState.words.length - 1;
    appState.visitedCount = appState.words.length;
  }

  renderWord();
  refreshProgress();
}
