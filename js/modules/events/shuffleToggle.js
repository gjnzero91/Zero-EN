// js/modules/events/shuffleToggle.js
// Xử lý sự kiện bật/tắt chế độ xáo trộn từ vựng

import { appState } from "../core/appState.js";
import { renderWord } from "../ui/render.js";

let originalOrder = [];

export function shuffleToggle() {
  appState.shuffleActive = !appState.shuffleActive;

  if (appState.shuffleActive) {
    // On shuffle
    originalOrder = [...appState.words];
    appState.words = shuffleArray([...appState.words]);
  } else {
    // Off shuffle
    if (originalOrder.length) {
      appState.words = [...originalOrder];
    }
  }

  appState.index = 0;

  // Update shuffle button UI
  const btn = document.getElementById("shuffleToggle");
  if (btn) {
    btn.classList.toggle("active", appState.shuffleActive);
    btn.title = appState.shuffleActive ? "Shuffle ON" : "Shuffle OFF";
  }

  renderWord();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
