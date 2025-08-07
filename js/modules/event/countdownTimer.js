// Zero-EN/js/modules/event/countdownTimer.js
// Xử lý đếm ngược thời gian trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";
import { getBookState } from "../core/appState.js";
import { goToNextWord } from "../vocab/vocabNavigate.js";

// Bộ nhớ đếm ngược nội bộ
let countdownInterval;
let currentCountdownTime;
let activeBookKeyForCountdown = null;

export function startCountdown(bookKey) {
  stopCountdown();

  activeBookKeyForCountdown = bookKey;
  const bookState = getBookState(bookKey);
  currentCountdownTime = bookState.countdownTime || 10;

  const countdownElement = getElement("countdown");
  const timeWrapper = getElement("timeWrapper");
  const nextBtn = getElement("next");

  if (countdownElement && timeWrapper && nextBtn) {
    timeWrapper.classList.add("visible"); // ✅ dùng class
    countdownElement.textContent = currentCountdownTime;

    countdownInterval = setInterval(() => {
      currentCountdownTime--;
      countdownElement.textContent = currentCountdownTime;

      if (currentCountdownTime <= 0) {
        stopCountdown();
        setTimeout(() => {
          goToNextWord(bookKey);
          if (getElement("timeWrapper")?.classList.contains("visible")) {
            startCountdown(bookKey);
          }
        }, 100);
      }
    }, 1000);
  }
}

export function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
    console.log("[DEBUG] Countdown stopped.");
  }

  const timeWrapper = getElement("timeWrapper");
  if (timeWrapper) {
    timeWrapper.classList.remove("visible"); // ✅ dùng class
  }

  activeBookKeyForCountdown = null;
}

export function isCountdownRunning(bookKey) {
  return activeBookKeyForCountdown === bookKey && countdownInterval !== null;
}

