// Zero-EN/js/modules/page/homeEvents.js
// Xử lý sự kiện trang home trong ứng dụng Zero-EN

import { observeAuthState, signOutUser } from "../auth/authService.js";
import { getElement, redirectTo } from "../core/domHelpers.js";
import { setGreeting } from "../auth/authUI.js";

export const setupHomeEventListeners = () => {
  observeAuthState(user => {
    if (user) {
      console.log("[homeEvents] Người dùng đã đăng nhập:", user.email); // Debug: Kiểm tra user object
      setGreeting(user.email.split('@')[0]);
    } else {
      console.log("[homeEvents] Người dùng chưa đăng nhập hoặc đã đăng xuất, chuyển hướng về login."); // Debug: Kiểm tra luồng này
      redirectTo("login.html");
    }
  });

  getElement("bookA1B1Btn")?.addEventListener("click", () => redirectTo("a1-b1.html"));
  getElement("bookB2C2Btn")?.addEventListener("click", () => redirectTo("b2-c2.html"));
  getElement("bookStarredBtn")?.addEventListener("click", () => redirectTo("star.html"));
  getElement("bookCustomBtn")?.addEventListener("click", () => redirectTo("custom.html"));
  getElement("homeBtn")?.addEventListener("click", () => redirectTo("home.html"));
  getElement("logoutBtn")?.addEventListener("click", () => {
    signOutUser().then(() => redirectTo("login.html"));
  });
};
