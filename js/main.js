// js/main.js
// Entry point chính của ứng dụng, xử lý routing và khởi tạo app

import { appState } from "./modules/core/appState.js";
import { checkExistingLogin } from "./modules/auth/login.js";
import { renderLoginPage } from "./modules/page/loginPage.js";
import { renderHomePage } from "./modules/page/homePage.js";
import { renderBookPage } from "./modules/page/bookPage.js";
import { renderCustomPage } from "./modules/page/customPage.js";
import { renderStarPage } from "./modules/page/starPage.js";
import { renderSearchPage } from "./modules/page/searchPage.js";

const root = document.getElementById("app");

// ====================== ROUTER ======================
function router() {
  const hash = window.location.hash || "#/login";

  if (!appState.user && hash !== "#/login") {
    window.location.hash = "#/login";
    return;
  }

  if (hash.startsWith("#/home")) {
    renderHomePage(root);
  } else if (hash.startsWith("#/bookA1B1")) {
    renderBookPage(root, "a1b1");
  } else if (hash.startsWith("#/bookB2C2")) {
    renderBookPage(root, "b2c2");
  } else if (hash.startsWith("#/bookStarred")) {
    renderStarPage(root);
  } else if (hash.startsWith("#/bookCustom")) {
    renderCustomPage(root);
  } else if (hash.startsWith("#/search")) {
    renderSearchPage(root);
  } else if (hash.startsWith("#/login")) {
    renderLoginPage(root);
  } else {
    window.location.hash = appState.user ? "#/home" : "#/login";
  }

  toggleHomeButton(hash.startsWith("#/home"));
}

// ====================== SHOW/HIDE HOME BTN ======================
function toggleHomeButton(isHomePage) {
  requestAnimationFrame(() => {
    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) {
      if (isHomePage) {
        homeBtn.classList.add("hidden");
      } else {
        homeBtn.classList.remove("hidden");
      }
    }
  });
}

// ====================== INIT ======================
window.addEventListener("DOMContentLoaded", async () => {
  await checkExistingLogin(); // check login 1 lần khi app load
  router(); // render route hiện tại
});

window.addEventListener("hashchange", router);
