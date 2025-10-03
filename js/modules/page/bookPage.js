// js/modules/page/bookPage.js
// Hiển thị trang học từ vựng (A1-B1 hoặc B2-C2)

import { renderWord } from "../ui/render.js";
import { appState, getDisplayName } from "../core/appState.js";
import { config } from "../core/config.js";
import { next, prev } from "../events/nextPrev.js";
import { starToggle } from "../events/starToggle.js";
import { shuffleToggle } from "../events/shuffleToggle.js";
import { setupClockDialog, setupClockButton } from "../events/clockToggle.js";
import { setupFlashcardDialog, setupFlashcardButton } from "../events/flashcardToggle.js";
import { searchToggle, setupSearchDialog } from "../events/searchToggle.js";
import { moonToggle } from "../events/moonToggle.js";
import { refreshProgress } from "../events/progressWrapper.js";
import { logout } from "../auth/logout.js";
import { loadStarredForUser } from "../core/loadStarred.js";
import { loadProgress } from "../core/progress.js";
import { setupPronounceButton } from "../events/pronounce.js";

export async function renderBookPage(root, type) {
  // Load data
  const file = type === "a1b1" ? config.dataset.a1b1 : config.dataset.b2c2;
  const res = await fetch(file, { cache: "no-store" });
  const data = await res.json();

  // Cả A1-B1 và B2-C2 đều lấy từ packages
  const words = data.packages?.flat() || [];
  appState.words = words;
  appState.page = type;
  appState.onNext = () => {
    if (appState.index < appState.words.length - 1) {
      appState.index++;
      renderWord();
    }
  };

  // ⏪ Load tiến độ đã lưu
  const savedIndex = loadProgress(type);
  appState.index = savedIndex ?? 0;

  // Load trạng thái sao từ local + Supabase
  await loadStarredForUser();

  // Layout
  root.innerHTML = `
    <div id="container" class="app-container">
      <div class="top-bar">
        <span id="moonToggle" class="icon">🌘</span>
        <span id="starToggle" class="icon">⭐</span>
        <span id="shuffleToggle" class="icon">🎲</span>
        <span id="clockToggle" class="icon">⏳</span>
        <span id="flashcardToggle" class="icon">🔖</span>
        <span id="searchToggle" class="icon">🔍</span>
      </div>

      <div class="countdown-wrapper" id="countdownWrapper">
        <div id="countdownProgress" class="countdown-progress"></div>
      </div>

      <div class="dialog-container">
        <div id="countdownDialog" class="countdown-dialog hidden">
          <input type="number" id="countdownInput" min="1" />
          <button id="setCountdownBtn">Set</button>
          <button id="cancelCountdownBtn">Cancel</button>
        </div>

        <div id="flashcardDialog" class="flashcard-dialog hidden">
          <input type="number" id="flashcardInput" min="1" />
          <button id="setFlashcardBtn">Set</button>
          <button id="cancelFlashcardBtn">Cancel</button>
        </div>

        <div id="searchDialog" class="search-dialog hidden">
          <input type="text" id="searchInput" placeholder="Search word..." />
          <button id="searchBtn">Find</button>
        </div>
      </div>

      <div class="content">
        <div id="wordDisplay" class="word">Loading...</div>
        <div id="posDisplay" class="pos"></div>
        <div id="ipaDisplay">
          <span id="ipaText"></span>
          <button id="pronounce">🔊</button>
        </div>
      </div>

      <div class="buttons">
        <button id="prev">Previous</button>
        <button id="next">Next</button>
      </div>

      <div class="page-title">${type === "a1b1" ? "A1-B1" : "B2-C2"}</div>

      <div class="progress-bar-container">
        <div id="progressBar"></div>
      </div>

      <div class="no-border-top">
        <button id="homeBtn" class="home-btn">Home</button>
        <span id="userName" class="user-greeting">${getDisplayName(appState.user)}</span>
        <button id="logoutBtn" class="logout-btn">Logout</button>
      </div>
    </div>
  `;

  // Events
  document.getElementById("next").addEventListener("click", () => {
    next(); renderWord(); refreshProgress();
  });
  document.getElementById("prev").addEventListener("click", () => {
    prev(); renderWord(); refreshProgress();
  });
  document.getElementById("moonToggle").addEventListener("click", moonToggle);
  document.getElementById("starToggle").addEventListener("click", starToggle);
  document.getElementById("shuffleToggle").addEventListener("click", shuffleToggle);
  document.getElementById("searchToggle").addEventListener("click", searchToggle);

  setupClockButton();
  setupClockDialog();
  setupFlashcardButton();
  setupFlashcardDialog();
  setupSearchDialog();
  setupPronounceButton();

  document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.hash = "#/home";
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
    window.location.hash = "#/login";
  });

  renderWord();
  refreshProgress();
}
