// js/modules/pageInit.js
// Khởi tạo và import các module.

import { setupLoginEventListeners } from "./authEvents.js";
import { setupHomeEventListeners } from "./homeEvents.js";
import { setupIndexEventListeners } from "./indexEvents.js";
import { setupVocabPage } from "./vocabPage.js";

const setupA1B1Page = () => setupVocabPage('a1-b1');
const setupB2C2Page = () => setupVocabPage('b2-c2');
const setupStarPage  = () => setupVocabPage('star');

export const initPage = (pageName) => {
  switch (pageName) {
    case "index.html":
      setupIndexEventListeners();
      break;
    case "login.html":
      setupLoginEventListeners();
      break;
    case "home.html":
      setupHomeEventListeners();
      break;
    case "a1-b1.html":
      setupA1B1Page();
      break;
    case "b2-c2.html":
      setupB2C2Page();
      break;
    case "star.html":
      setupStarPage();
      break;
    default:
      console.log("No specific logic for this page.");
  }
};