// Zero-EN/js/modules/event/customEvents.js
// Xử lý sự kiện cho các nút điều hướng trong trang tùy chỉnh

import { getElement } from "../core/domHelpers.js";
import { loadCustomLesson } from "../vocab/customController.js";

export function setupCustomEvents() {
  const prevBtn = getElement("prevLesson");
  const nextBtn = getElement("nextLesson");

  if (prevBtn) {
    prevBtn.onclick = () => loadCustomLesson("prev");
  }

  if (nextBtn) {
    nextBtn.onclick = () => loadCustomLesson("next");
  }
}
