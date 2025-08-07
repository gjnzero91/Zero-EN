// Zero-EN/js/modules/event/clockEvents.js
// Xử lý sự kiện đồng hồ trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";
import { getBookState, setBookStateProperty } from "../core/appState.js";
import { startCountdown, stopCountdown } from "./countdownTimer.js";
import { saveLocalState } from "../core/appState.js";

export function attachClockEvent(bookKey) {
  const toggle = getElement("clockToggle");
  const dialog = getElement("countdownDialog");
  const input = getElement("countdownInput");
  const setBtn = getElement("setCountdownBtn");
  const cancelBtn = getElement("cancelCountdownBtn");

  if (!toggle || !dialog || !input || !setBtn || !cancelBtn) return;

  let holdTimeout = null;

  // Nhấn giữ để mở hộp nhập
  toggle.addEventListener("mousedown", () => {
    holdTimeout = setTimeout(() => {
      dialog.classList.remove("hidden");
      const current = getBookState(bookKey).countdownTime || 10;
      input.value = current;
    }, 500); // giữ 500ms để mở dialog
  });

  toggle.addEventListener("mouseup", () => {
    clearTimeout(holdTimeout);
  });

  // Click bình thường để bật/tắt
  toggle.addEventListener("click", () => {
    const state = getBookState(bookKey);
    const active = !state.countdownActive;
    setBookStateProperty(bookKey, "countdownActive", active);
    saveLocalState();

    toggle.classList.toggle("active", active);

    if (active) {
      startCountdown(bookKey);
    } else {
      stopCountdown();
    }
  });

  // Set countdown mới
  setBtn.addEventListener("click", () => {
    const seconds = parseInt(input.value);
    if (!isNaN(seconds) && seconds > 0) {
      setBookStateProperty(bookKey, "countdownTime", seconds);
      saveLocalState();
    }

    dialog.classList.add("hidden");
    stopCountdown();

    if (getBookState(bookKey).countdownActive) {
      startCountdown(bookKey);
    }
  });

  cancelBtn.addEventListener("click", () => {
    dialog.classList.add("hidden");
  });
}
