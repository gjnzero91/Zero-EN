// js/modules/ui/updateIcons.js
import { appState } from "../core/appState.js";

export function updateIcons() {
  const item = appState.words[appState.index];

  // ⭐ Star
  const star = document.getElementById("starToggle");
  if (star && item) {
    const isStar = appState.starred.has(item.word);
    star.classList.toggle("active", !!isStar);
    star.title = isStar ? "Unstar" : "Star";
  }

  // 🎲 Shuffle
  const shuffle = document.getElementById("shuffleToggle");
  if (shuffle) {
    shuffle.classList.toggle("active", !!appState.shuffleActive);
    shuffle.title = appState.shuffleActive ? "Shuffle ON" : "Shuffle OFF";
  }

  // ⏱ Clock
  const clock = document.getElementById("clockToggle");
  if (clock) {
    const isActive = appState.timerActive === "clock";
    clock.classList.toggle("active", isActive);
    clock.title = isActive ? "Auto Next ON" : "Auto Next OFF";
  }

  // 🔍 Search
  const search = document.getElementById("searchToggle");
  if (search) {
    search.classList.toggle("active", !!appState.searchActive);
    search.title = appState.searchActive ? "Search ON" : "Search OFF";
  }

  // 🔖 Flashcard
  const flash = document.getElementById("flashcardToggle");
  if (flash) {
    const isActive = appState.timerActive === "flashcard";
    flash.classList.toggle("active", isActive);
    flash.title = isActive ? "Flashcard ON" : "Flashcard OFF";
  }

  // 🌘 Dark mode
  const moon = document.getElementById("moonToggle");
  if (moon) {
    moon.classList.toggle("active", !!appState.darkMode);
    moon.title = appState.darkMode ? "Dark Mode ON" : "Dark Mode OFF";
  }

  // Countdown progress
  const cdWrapper = document.getElementById("countdownWrapper");
  const cdBar = document.getElementById("countdownProgress");

  if (cdWrapper && cdBar) {
    if (appState.timerActive && appState.timerSec != null && appState.timerTotal) {
      cdWrapper.classList.add("active");
      const percent = Math.max(0, Math.min(1, appState.timerSec / appState.timerTotal)) * 100;
      cdBar.style.width = percent + "%";
    } else {
      cdWrapper.classList.remove("active");
      cdBar.style.width = "100%";
    }
  }
}
