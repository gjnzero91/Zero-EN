// Zero-EN/js/modules/event/vocabEvents.js
// Xử lý sự kiện từ vựng trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";
import { goToNextWord, goToPrevWord } from "../vocab/vocabNavigate.js";
import { attachShuffleEvent } from "./shuffleEvents.js"; // ✅ Thêm dòng này
import { attachClockEvent } from "../event/clockEvents.js";
import { attachStarEvent } from "./starEvents.js";

export function setupVocabEvents(bookKey) {
  const nextBtn = getElement("next");
  const prevBtn = getElement("prev");

  if (nextBtn) {
    nextBtn.onclick = () => {
      goToNextWord(bookKey);
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      goToPrevWord(bookKey);
    };
  }

  attachShuffleEvent(bookKey);
  attachClockEvent(bookKey);
  attachStarEvent(bookKey);

  console.log("✅ setupVocabEvents gán thành công.");
}

