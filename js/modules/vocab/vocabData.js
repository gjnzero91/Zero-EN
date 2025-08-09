// Zero-EN/js/modules/vocab/vocabData.js
// Quản lý dữ liệu từ vựng trong ứng dụng Zero-EN (lấy từ GitHub JSON cho a1-b1, b2-c2)

import { fetchWordsFromJson, getStarredWordsData } from "../data/dataService.js";
import { getCurrentUser } from "../auth/authService.js";
import { getBookState, setBookStateProperty } from "../core/appState.js";

// === Link JSON trên GitHub ===
const GITHUB_DATA = {
  "a1-b1": "https://raw.githubusercontent.com/USERNAME/REPO_NAME/branch/data/3000.json",
  "b2-c2": "https://raw.githubusercontent.com/USERNAME/REPO_NAME/branch/data/5000.json"
};

export async function getWordsData(bookKey) {
  if (bookKey === "a1-b1") {
    return await fetchWordsFromJson(GITHUB_DATA["a1-b1"]);
  }

  if (bookKey === "b2-c2") {
    return await fetchWordsFromJson(GITHUB_DATA["b2-c2"]);
  }

  if (bookKey === "star") {
    const user = getCurrentUser();
    if (!user) return [];
    return await getStarredWordsData();
  }

  return [];
}

export async function initializeBookData(bookKey, forceReload = false) {
  let bookState = getBookState(bookKey);

  if (forceReload || !bookState?.words?.length) {
    const words = await getWordsData(bookKey);
    setBookStateProperty(bookKey, "words", words);
    setBookStateProperty(bookKey, "currentIndex", 0);
    setBookStateProperty(bookKey, "shuffleMode", false);
    setBookStateProperty(bookKey, "shuffledIndices", []);
    if (typeof bookState.countdownTime === "undefined") {
      setBookStateProperty(bookKey, "countdownTime", 10);
    }
  }

  return getBookState(bookKey);
}

export async function loadBook(bookKey) {
  const updatedBookState = await initializeBookData(bookKey, bookKey === "star");

  const searchTarget = JSON.parse(localStorage.getItem("searchTarget"));
  if (searchTarget?.key === bookKey && typeof searchTarget.idx === "number") {
    setBookStateProperty(bookKey, "currentIndex", searchTarget.idx);
    localStorage.removeItem("searchTarget");
  }

  if (!updatedBookState?.words?.length) {
    console.warn("No words loaded after initialization:", updatedBookState);
  }

  await import("./vocabDisplay.js").then(module => module.loadWord(bookKey));
}
