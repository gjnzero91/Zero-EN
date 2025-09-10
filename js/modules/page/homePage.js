// js/modules/page/homePage.js
// Hiển thị trang chủ với lựa chọn điều hướng

import { appState, getDisplayName } from "../core/appState.js";
import { logout } from "../auth/logout.js";

export function renderHomePage(root) {
  root.innerHTML = `
    <div id="container" class="app-container">
      <div class="content">
        <div id="homeTitle">HOME</div>
      </div>

      <div id="bookSelectionContainer">
        <div class="button-grid">
          <button id="bookA1B1Btn" class="book-selection-btn">📦 A1-B1</button>
          <button id="bookB2C2Btn" class="book-selection-btn">📦 B2-C2</button>
          <button id="bookStarredBtn" class="book-selection-btn">⭐ Starred</button>
          <button id="bookCustomBtn" class="book-selection-btn">💼 Custom</button>
        </div>
      </div>

      <div class="bottom-bar">
        <button id="homeBtn" class="home-btn">Home</button>
        <span id="userName" class="user-greeting">${getDisplayName(appState.user)}</span>
        <button id="logoutBtn" class="logout-btn">Logout</button>
      </div>
    </div>
  `;

  // Điều hướng
  document.getElementById("bookA1B1Btn").addEventListener("click", () => {
    window.location.hash = "#/bookA1B1";
  });
  document.getElementById("bookB2C2Btn").addEventListener("click", () => {
    window.location.hash = "#/bookB2C2";
  });
  document.getElementById("bookStarredBtn").addEventListener("click", () => {
    window.location.hash = "#/bookStarred";
  });
  document.getElementById("bookCustomBtn").addEventListener("click", () => {
    window.location.hash = "#/bookCustom";
  });

  // Home button
  document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.hash = "#/home";
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
    window.location.hash = "#/login";
  });
}
