// js/modules/events/flashcardToggle.js
import { appState } from "../core/appState.js";
import { updateIcons } from "../ui/updateIcons.js";
import { stopTimer, startTimer } from "./clockToggle.js";

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

export function flashcardToggle() {
  if (appState.timerActive === "flashcard") {
    stopTimer();
  } else {
    startTimer("flashcard", appState.settings.flashcardSeconds ?? 5);
  }
  updateIcons();
}

function startFlashcard(seconds) {
  stopTimer();

  appState.timerActive = "flashcard";
  appState.timerTotal = seconds;
  appState.timerSec = seconds;

  appState.onFlip = () => {
    const cur = appState.words[appState.index];
    if (cur?.word) speak(cur.word);
  };

  appState.timers.interval = setInterval(() => {
    appState.timerSec -= 1;

    if (appState.timerSec <= 0) {
      appState.timerSec = appState.timerTotal;
      if (typeof appState.onFlip === "function") {
        appState.onFlip();
      }
    }

    updateIcons();
  }, 1000);

  updateIcons();
}

export function setupFlashcardButton() {
  const icon = document.getElementById("flashcardToggle");
  const dialog = document.getElementById("flashcardDialog");
  const input = document.getElementById("flashcardInput");

  if (!icon || !dialog || !input) return;

  let longPressTimer = null;
  let longPressTriggered = false;
  const LONG_MS = 800;

  function startPress() {
    longPressTriggered = false;
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      if (appState.timerActive === "flashcard") stopTimer();
      input.value = appState.settings.flashcardSeconds ?? 5;
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
      flashcardToggle();
    }
    longPressTriggered = false;
  });
}

export function setupFlashcardDialog() {
  const dialog = document.getElementById("flashcardDialog");
  const input = document.getElementById("flashcardInput");
  const setBtn = document.getElementById("setFlashcardBtn");
  const cancelBtn = document.getElementById("cancelFlashcardBtn");

  if (!dialog || !input || !setBtn || !cancelBtn) return;

  setBtn.addEventListener("click", () => {
    const seconds = parseInt(input.value, 10);
    if (!isNaN(seconds) && seconds >= 3 && seconds <= 60) {
      appState.settings.flashcardSeconds = seconds;
      if (appState.timerActive === "flashcard") {
        stopTimer();
        startFlashcard(seconds);
      }
    }
    dialog.classList.add("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    dialog.classList.add("hidden");
  });
}
