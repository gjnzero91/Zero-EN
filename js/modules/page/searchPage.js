// js/modules/page/searchPage.js
// Trang tìm kiếm hiển thị từ riêng biệt

import { renderWord } from "../ui/render.js";
import { appState, getDisplayName } from "../core/appState.js";
import { config } from "../core/config.js";
import { starToggle } from "../events/starToggle.js";
import { moonToggle } from "../events/moonToggle.js";
import { flashcardToggle, setupFlashcardButton, setupFlashcardDialog } from "../events/flashcardToggle.js";
import { logout } from "../auth/logout.js";
import { refreshProgress } from "../events/progressWrapper.js";
import { loadStarredForUser } from "../core/loadStarred.js";
import { searchToggle, setupSearchDialog } from "../events/searchToggle.js";

// Lấy query param từ URL
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.hash.split("?")[1]);
  return params.get(name);
}

export async function renderSearchPage(root) {
  // Load dữ liệu A1-B1 + B2-C2
  const resA1B1 = await fetch(config.dataset.a1b1, { cache: "no-store" });
  const resB2C2 = await fetch(config.dataset.b2c2, { cache: "no-store" });

  const dataA1B1 = await resA1B1.json();
  const dataB2C2 = await resB2C2.json();

  // Gom tất cả các từ
  const words = [
    ...(dataA1B1.packages?.flat() || []),
    ...(dataB2C2.packages?.flat() || [])
  ];

  appState.words = words;
  appState.index = 0;
  appState.page = "search";

  // Lấy từ khóa tìm kiếm từ URL
  const searchWord = getQueryParam("word");
  if (searchWord) {
    const index = words.findIndex(
      w => w.word?.toLowerCase() === searchWord.toLowerCase()
    );
    if (index >= 0) {
      appState.index = index;
    }
  }

  // Load trạng thái sao
  await loadStarredForUser();

  // Layout
  root.innerHTML = `
    <div id="container" class="app-container">
      <div class="top-bar">
        <span id="moonToggle" class="icon">🌘</span>
        <span id="starToggle" class="icon">⭐</span>
        <span id="flashcardToggle" class="icon">🔖</span>
        <span id="searchToggle" class="icon">🔍</span>
      </div>

      <div class="top-bar">
        <span id="countdownFlashcard" class="countdown-text"></span>
      </div>

      <div class="dialog-container">
        <div id="flashcardDialog" class="flashcard-dialog hidden">
          <input type="number" id="flashcardInput" min="1" />
          <button id="setFlashcardBtn">Set</button>
          <button id="cancelFlashcardBtn">Cancel</button>
        </div>

      </div>
        <div id="searchDialog" class="search-dialog hidden">
          <input type="text" id="searchInput" placeholder="Search word..." />
          <button id="searchBtn">Find</button>
        </div>

      <div class="content">
        <div id="wordDisplay" class="word">Loading...</div>
        <div id="posDisplay" class="pos"></div>
        <div id="ipaDisplay">
          <span id="ipaText"></span>
          <button id="pronounce">🔊</button>
        </div>
      </div>

      <div class="page-title">SEARCH</div>

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

  // Sự kiện toggle
  document.getElementById("moonToggle").addEventListener("click", moonToggle);
  document.getElementById("starToggle").addEventListener("click", starToggle);
  document.getElementById("flashcardToggle").addEventListener("click", flashcardToggle);
  document.getElementById("searchToggle").addEventListener("click", searchToggle);

  // Setup flashcard
  setupFlashcardButton();
  setupFlashcardDialog();

  // Setup search
  setupSearchDialog();

  // Override hành vi flashcard trong trang search
  const flashBtn = document.getElementById("flashcardToggle");
  if (flashBtn) {
    flashBtn.addEventListener("click", () => {
      flashcardToggle(); // vẫn toggle trạng thái + UI

      if (appState.flashcardActive) {
        // Nếu đang bật flashcard → phát âm lại từ hiện tại
        const pronounceBtn = document.getElementById("pronounce");
        if (pronounceBtn) pronounceBtn.click();
      }
    });
  }

  // Navigation
  document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.hash = "#/home";
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
    window.location.hash = "#/login";
  });

  // Render từ đầu tiên hoặc từ tìm được
  renderWord();
  refreshProgress();
}
