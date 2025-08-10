// Zero-EN/js/modules/event/navEvents.js
// Xử lý sự kiện điều hướng trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";
import { stopCountdown } from "../event/countdownTimer.js";
import { goToPrevWord, goToNextWord } from "../vocab/vocabNavigate.js";

// Thêm import để đồng bộ tiến trình học
import { saveUserDataToFirestore } from "../data/dataService.js";
import { getCurrentUser } from "../auth/authService.js";
import { getBookState } from "../core/appState.js";

async function syncProgress() {
  const user = getCurrentUser();
  if (user) {
    await saveUserDataToFirestore(user.uid, {
      "a1-b1": getBookState("a1-b1"),
      "b2-c2": getBookState("b2-c2"),
      "star": getBookState("star")
    });
    console.log("✅ Tiến trình học đã đồng bộ lên Firestore");
  }
}

export function attachNavEvents(bookKey) {
  const prevBtn = getElement("prev");
  const nextBtn = getElement("next");

  if (prevBtn) {
    prevBtn.onclick = async () => {
      stopCountdown();
      goToPrevWord(bookKey);
      await syncProgress(); // Lưu khi chuyển từ
    };
  }

  if (nextBtn) {
    nextBtn.onclick = async () => {
      stopCountdown();
      goToNextWord(bookKey);
      await syncProgress(); // Lưu khi chuyển từ
    };
  }

  // Thêm sự kiện bàn phím
  document.addEventListener("keydown", async (e) => {
    if (e.key === "ArrowLeft") {
      prevBtn?.click();
    }
    if (e.key === "ArrowRight") {
      nextBtn?.click();
    }
  });
}
