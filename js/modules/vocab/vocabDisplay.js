// Zero-EN/js/modules/vocab/vocabDisplay.js
// Hiển thị từ vựng trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";
import { getBookState } from "../core/appState.js";
import { getStarredWords } from "../data/dataService.js";
import { updateProgressBar, updateStarIcon } from "../ui/progressUI.js";
import { updateWordDisplay, speak } from "../ui/wordUI.js";
import { stopCountdown, startCountdown } from "../event/countdownTimer.js";

export async function loadWord(bookKey) {
  const bookState = getBookState(bookKey);

  const wordDisplay = getElement("wordDisplay");
  const posDisplay = getElement("posDisplay");
  const ipaText = getElement("ipaText");
  const starIcon = getElement("starIcon"); // có thể null nếu trang không có icon
  const pronounceBtn = getElement("pronounce");
  const noWordsMessage = getElement("noWordsMessage"); // có thể null
  const countdownElement = getElement("countdown");
  const progressBar = getElement("progressBar");

  // Nếu không có dữ liệu từ
  if (!bookState?.words?.length) {
    if (wordDisplay) wordDisplay.textContent = "No words found.";
    if (noWordsMessage) noWordsMessage.style.display = "block";
    updateProgressBar(progressBar, { currentIndex: 0, words: [] });
    stopCountdown();
    return;
  }

  // Lấy index hiện tại
  const currentIndex = bookState.shuffleMode
    ? bookState.shuffledIndices[bookState.currentIndex]
    : bookState.currentIndex;

  // Lấy từ hiện tại
  const currentWordObj = bookState.words[currentIndex];
  if (!currentWordObj) {
    if (wordDisplay) wordDisplay.textContent = "Error: Word not found.";
    stopCountdown();
    return;
  }

  // Cập nhật giao diện từ vựng
  updateWordDisplay(currentWordObj);

  // Cập nhật thanh tiến trình
  updateProgressBar(progressBar, bookState);

  // Cập nhật nút star (nếu có)
  if (starIcon) {
    updateStarIcon(starIcon, currentWordObj.word, await getStarredWords());
  }

  // Cập nhật nút phát âm
  if (pronounceBtn) {
    pronounceBtn.onclick = () => speak(currentWordObj.word);
  }

  // Khởi động countdown nếu đang bật
  if (bookState.countdownActive) {
    startCountdown(bookKey);
  }
}
