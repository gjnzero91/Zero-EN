// js/modules/page/starPage.js
import { renderWord } from "../ui/render.js";
import { appState, getDisplayName } from "../core/appState.js";
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
import { loadProgress } from "../core/progress.js";   // ✅ thêm dòng này

export async function renderStarPage(root) {
  // ensure starred loaded
  await loadStarredForUser();

  const words = Array.from(appState.starred || []).map(w => ({ word: w }));
  appState.words = words;
  appState.page = "starred";

  // ✅ load lại tiến độ thay vì luôn reset
  const savedIndex = loadProgress("starred");
  appState.index = savedIndex ?? 0;

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

      <div id="countdownWrapper" class="progress-bar-container hidden">
        <div id="countdownProgress" class="progress-bar"></div>
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
        <div id="wordDisplay" class="word">${words.length ? "Loading..." : "No words"}</div>
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

      <div class="page-title">STAR</div>

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
  document.getElementById("homeBtn").addEventListener("click", () => { window.location.hash = "#/home"; });
  document.getElementById("logoutBtn").addEventListener("click", () => { logout(); window.location.hash = "#/login"; });

  if (!words.length) return;

  document.getElementById("next").addEventListener("click", () => { next(); renderWord(); refreshProgress(); });
  document.getElementById("prev").addEventListener("click", () => { prev(); renderWord(); refreshProgress(); });

  document.getElementById("moonToggle").addEventListener("click", moonToggle);
  document.getElementById("starToggle").addEventListener("click", starToggle);
  document.getElementById("shuffleToggle").addEventListener("click", shuffleToggle);
  document.getElementById("searchToggle").addEventListener("click", searchToggle);

  setupClockButton();
  setupClockDialog();
  setupFlashcardButton();
  setupFlashcardDialog();
  setupSearchDialog();

  renderWord();
  refreshProgress();
}
