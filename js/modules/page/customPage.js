// js/modules/page/customPage.js
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
import { loadCustomLessons } from "../core/loadCustomLessons.js";
import { loadProgress } from "../core/progress.js";

export async function renderCustomPage(root) {
  // Load lessons
  appState.lessons = await loadCustomLessons();
  appState.currentLesson = appState.currentLesson ?? 0;
  appState.words = appState.lessons?.[appState.currentLesson] || [];
  appState.page = "custom";

  // ✅ load lại tiến độ thay vì reset
  const savedIndex = loadProgress("custom");
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
        <div id="wordDisplay" class="word">${appState.words.length ? "Loading..." : "No words"}</div>
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

      <div class="buttons">
        <button id="prevLesson">Prev Lesson</button>
        <button id="nextLesson">Next Lesson</button>
      </div>

      <div class="page-title">CUSTOM</div>

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
  document.getElementById("next").addEventListener("click", () => { next(); renderWord(); refreshProgress(); });
  document.getElementById("prev").addEventListener("click", () => { prev(); renderWord(); refreshProgress(); });

  // Lesson navigation
  document.getElementById("nextLesson").addEventListener("click", () => {
    if (!appState.lessons?.length) return;
    appState.currentLesson = (appState.currentLesson + 1) % appState.lessons.length;
    appState.words = appState.lessons[appState.currentLesson];
    appState.index = 0;
    renderWord(); refreshProgress();
  });
  document.getElementById("prevLesson").addEventListener("click", () => {
    if (!appState.lessons?.length) return;
    appState.currentLesson = (appState.currentLesson - 1 + appState.lessons.length) % appState.lessons.length;
    appState.words = appState.lessons[appState.currentLesson];
    appState.index = 0;
    renderWord(); refreshProgress();
  });

  // Toggles
  document.getElementById("moonToggle").addEventListener("click", moonToggle);
  document.getElementById("starToggle").addEventListener("click", starToggle);
  document.getElementById("shuffleToggle").addEventListener("click", shuffleToggle);
  document.getElementById("searchToggle").addEventListener("click", searchToggle);

  setupClockButton();
  setupClockDialog();
  setupFlashcardButton();
  setupFlashcardDialog();
  setupSearchDialog();

  document.getElementById("homeBtn").addEventListener("click", () => { window.location.hash = "#/home"; });
  document.getElementById("logoutBtn").addEventListener("click", () => { logout(); window.location.hash = "#/login"; });

  renderWord();
  refreshProgress();
}
