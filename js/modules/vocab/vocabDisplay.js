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
  const starIcon = getElement("starIcon");
  const pronounceBtn = getElement("pronounce");
  const noWordsMessage = getElement("noWordsMessage");
  const countdownElement = getElement("countdown");
  const progressBar = getElement("progressBar");

  if (!bookState?.words?.length) {
    if (wordDisplay) wordDisplay.textContent = "No words found.";
    if (noWordsMessage) noWordsMessage.style.display = "block";
    updateProgressBar(progressBar, { currentIndex: 0, words: [] });
    stopCountdown();
    return;
  }

  const currentIndex = bookState.shuffleMode
    ? bookState.shuffledIndices[bookState.currentIndex]
    : bookState.currentIndex;
  const currentWordObj = bookState.words[currentIndex];

  if (!currentWordObj) {
    wordDisplay.textContent = "Error: Word not found at current index.";
    stopCountdown();
    return;
  }

  updateWordDisplay(currentWordObj);

  if (currentWordObj.word) {
    speak(currentWordObj.word);
  }
  updateProgressBar(progressBar, bookState);
  updateStarIcon(starIcon, currentWordObj.word, await getStarredWords());

  if (pronounceBtn) {
    pronounceBtn.onclick = () => speak(currentWordObj.word);
  }

  if (bookState.countdownActive) {
    startCountdown(bookKey);
  }
}