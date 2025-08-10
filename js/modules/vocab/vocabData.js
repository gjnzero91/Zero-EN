// Zero-EN/js/modules/vocab/vocabData.js
// Quản lý dữ liệu từ vựng trong ứng dụng Zero-EN

import { fetchWordsFromJson, getStarredWordsData } from "../data/dataService.js";
import { getCurrentUser } from "../auth/authService.js";
import { getBookState, setBookStateProperty } from "../core/appState.js";

// Link GitHub JSON
const GITHUB_DATA = {
  "a1-b1": "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/3000.json",
  "b2-c2": "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/5000.json"
};

export async function getWordsData(bookKey) {
  if (bookKey === "a1-b1" || bookKey === "b2-c2") {
    let data = await fetchWordsFromJson(GITHUB_DATA[bookKey]);

    // Nếu dữ liệu có dạng { packages: [...] } thì lấy ra packages
    if (data && typeof data === "object" && !Array.isArray(data) && data.packages) {
      data = data.packages.flat(); // gộp tất cả package thành 1 mảng
    }

    return Array.isArray(data) ? data : [];
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

  const { loadWord } = await import("./vocabDisplay.js");
  loadWord(bookKey);
}
