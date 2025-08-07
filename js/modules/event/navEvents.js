// Zero-EN/js/modules/event/navEvents.js
// Xử lý sự kiện điều hướng trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";
import { stopCountdown } from "../event/countdownTimer.js"; // ✅ Đúng
import { goToPrevWord, goToNextWord } from "../vocab/vocabNavigate.js";

export function attachNavEvents(bookKey) {
  const prevBtn = getElement("prev");
  const nextBtn = getElement("next");

  if (prevBtn) {
    prevBtn.onclick = () => {
      stopCountdown();
      goToPrevWord(bookKey);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      stopCountdown();
      goToNextWord(bookKey);
    };
  }

  // Thêm sự kiện bàn phím ở đây, sau khi DOM có nút
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevBtn?.click();
    if (e.key === "ArrowRight") nextBtn?.click();
  });
}