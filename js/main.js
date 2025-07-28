// js/main.js

import { initPage } from "./modules/init.js";

const pathSegments = window.location.pathname.split("/");
const currentPage = pathSegments[pathSegments.length - 1] || "index.html";

document.addEventListener("DOMContentLoaded", () => {
  initPage(currentPage);
});