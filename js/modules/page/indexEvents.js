// Zero-EN/js/modules/page/indexEvents.js
// Xử lý sự kiện trang index trong ứng dụng Zero-EN

import { getElement, redirectTo } from "../core/domHelpers.js";

export const setupIndexEventListeners = () => {
  getElement("getStartedBtn")?.addEventListener("click", () => redirectTo("login.html"));
};