// js/modules/homeEvents.js
// Sự kiện trang chủ.

import { observeAuthState, signOutUser } from "./authService.js";
import { getElement, redirectTo } from "./domHelpers.js";
import { setGreeting } from "./authUI.js";

export const setupHomeEventListeners = () => {
  observeAuthState(user => {
    if (user) {
      setGreeting(user.email.split('@')[0]);
    } else {
      redirectTo("login.html");
    }
  });
  getElement("bookA1B1Btn")?.addEventListener("click", () => redirectTo("a1-b1.html"));
  getElement("bookB2C2Btn")?.addEventListener("click", () => redirectTo("b2-c2.html"));
  getElement("bookStarredBtn")?.addEventListener("click", () => redirectTo("star.html"));
  getElement("homeBtn")?.addEventListener("click", () => redirectTo("home.html"));
  getElement("logoutBtn")?.addEventListener("click", () => {
    signOutUser().then(() => redirectTo("login.html"));
  });
};