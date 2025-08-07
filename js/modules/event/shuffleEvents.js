// Zero-EN/js/modules/event/shuffleEvents.js
// Xử lý sự kiện xáo trộn từ trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";
import { getBookState, setBookStateProperty } from "../core/appState.js";
import { stopCountdown } from "../event/countdownTimer.js";
import { loadBook } from "../vocab/vocabData.js";

export function attachShuffleEvent(bookKey) {
  const shuffleToggle = getElement("shuffleToggle");
  if (!shuffleToggle) return;

  shuffleToggle.onclick = async () => {
    const bookState = getBookState(bookKey);
    const newShuffleMode = !bookState.shuffleMode;
    setBookStateProperty(bookKey, "shuffleMode", newShuffleMode);
    shuffleToggle.classList.toggle("active", newShuffleMode);

    if (newShuffleMode) {
      const words = bookState.words;
      if (words?.length) {
        const indices = Array.from({ length: words.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        setBookStateProperty(bookKey, "shuffledIndices", indices);
      } else {
        setBookStateProperty(bookKey, "shuffledIndices", []);
      }
      setBookStateProperty(bookKey, "currentIndex", 0);
    }

    stopCountdown();
    await loadBook(bookKey);
  };
}
