// js/modules/events/clockToggle.js
import { appState } from "../core/appState.js";
import { updateIcons } from "../ui/updateIcons.js";

// Toggle chế độ clock
export function clockToggle() {
  if (appState.timerActive === "clock") {
    stopTimer();
  } else {
    startTimer("clock", appState.settings.clockSeconds ?? 5);
  }
  updateIcons();
}

// Bắt đầu timer chung
export function startTimer(mode, seconds) {
  stopTimer();
  appState.timerActive = mode;
  appState.timerTotal = seconds;
  appState.timerSec = seconds;

  appState.timers.interval = setInterval(() => {
    appState.timerSec -= 1;

    if (appState.timerSec <= 0) {
      appState.timerSec = appState.timerTotal;

      if (mode === "clock" && typeof appState.onNext === "function") {
        appState.onNext();
      }

      if (mode === "flashcard") {
        const cur = appState.words[appState.index];
        if (cur?.word) {
          const u = new SpeechSynthesisUtterance(cur.word);
          u.lang = "en-US";
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        }
      }
    }

    updateIcons();
  }, 1000);

  updateIcons();
}

// Dừng timer
export function stopTimer() {
  if (appState.timers.interval) {
    clearInterval(appState.timers.interval);
    appState.timers.interval = null;
  }
  appState.timerActive = null;
  appState.timerSec = null;
  appState.timerTotal = null;

  updateIcons();
}

// Setup nút clock (click ngắn / long press mở dialog)
let longPressTimer = null;
let longPressTriggered = false;

export function setupClockButton() {
  const icon = document.getElementById("clockToggle");
  const dialog = document.getElementById("countdownDialog");
  const input = document.getElementById("countdownInput");

  if (!icon || !dialog || !input) return;

  const LONG_MS = 800;

  function startPress() {
    longPressTriggered = false;
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      if (appState.timerActive === "clock") stopTimer();
      input.value = appState.settings.clockSeconds ?? 5;
      dialog.classList.remove("hidden");
    }, LONG_MS);
  }

  function cancelPress() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  icon.addEventListener("mousedown", startPress);
  icon.addEventListener("touchstart", startPress, { passive: true });
  icon.addEventListener("mouseup", cancelPress);
  icon.addEventListener("mouseleave", cancelPress);
  icon.addEventListener("touchend", cancelPress);

  icon.addEventListener("click", () => {
    if (!longPressTriggered) {
      clockToggle();
    }
    longPressTriggered = false;
  });
}

// Setup dialog chỉnh thời gian
export function setupClockDialog() {
  const dialog = document.getElementById("countdownDialog");
  const input = document.getElementById("countdownInput");
  const setBtn = document.getElementById("setCountdownBtn");
  const cancelBtn = document.getElementById("cancelCountdownBtn");

  if (!dialog || !input || !setBtn || !cancelBtn) return;

  setBtn.addEventListener("click", () => {
    const seconds = parseInt(input.value, 10);
    if (!isNaN(seconds) && seconds >= 3 && seconds <= 60) {
      appState.settings.clockSeconds = seconds;
      if (appState.timerActive === "clock") {
        stopTimer();
        startTimer("clock", seconds);
      }
    }
    dialog.classList.add("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    dialog.classList.add("hidden");
  });
}
