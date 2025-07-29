// js/modules/indexEvents.js
// Sự kiện trang index.

import { getElement, redirectTo } from "./domHelpers.js";

export const setupIndexEventListeners = () => {
  getElement("getStartedBtn")?.addEventListener("click", () => redirectTo("login.html"));
};