// js/modules/events/progressWrapper.js
// Xử lý cập nhật thanh tiến trình và lưu trạng thái tiến trình học từ vựng

import { appState } from "../core/appState.js";
import { updateProgressBar } from "../events/progressBar.js";
import { Storage } from "../core/storage.js";

export function refreshProgress() {
  updateProgressBar("progressBar", appState.index + 1, appState.words.length);

  Storage.saveProgress(appState.page, {
    index: appState.index,
    visitedCount: appState.visitedCount
  });
}
