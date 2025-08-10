// Zero-EN/js/modules/event/navEvents.js
// Xử lý sự kiện điều hướng trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";
import { stopCountdown } from "../event/countdownTimer.js";
import { goToPrevWord, goToNextWord } from "../vocab/vocabNavigate.js";
import { loadCustomLesson } from "../vocab/customController.js";
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
  const prevLessonBtn = getElement("prevLesson");
  const nextLessonBtn = getElement("nextLesson");

  // Điều hướng từng từ
  const handlePrevWord = async () => {
    stopCountdown();
    if (bookKey === "custom") {
      // Trong custom mode, prev/next word chưa có → có thể bổ sung sau
      console.log("Custom: prev word (chưa implement)");
    } else {
      goToPrevWord(bookKey);
      await syncProgress();
    }
  };

  const handleNextWord = async () => {
    stopCountdown();
    if (bookKey === "custom") {
      // Trong custom mode, prev/next word chưa có → có thể bổ sung sau
      console.log("Custom: next word (chưa implement)");
    } else {
      goToNextWord(bookKey);
      await syncProgress();
    }
  };

  // Điều hướng giữa các lesson (chỉ cho custom)
  const handlePrevLesson = () => {
    if (bookKey === "custom") {
      loadCustomLesson("prev");
    }
  };

  const handleNextLesson = () => {
    if (bookKey === "custom") {
      loadCustomLesson("next");
    }
  };

  // Gán sự kiện nút
  if (prevBtn) prevBtn.onclick = handlePrevWord;
  if (nextBtn) nextBtn.onclick = handleNextWord;
  if (prevLessonBtn) prevLessonBtn.onclick = handlePrevLesson;
  if (nextLessonBtn) nextLessonBtn.onclick = handleNextLesson;

  // Bàn phím ← →
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") handlePrevWord();
    if (e.key === "ArrowRight") handleNextWord();
  });
}
