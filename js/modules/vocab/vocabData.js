// Zero-EN/js/modules/vocab/vocabData.js
// Quản lý dữ liệu từ vựng trong ứng dụng Zero-EN

import { fetchWordsFromCsv, getStarredWordsData } from "../data/dataService.js";
import { getCurrentUser } from "../auth/authService.js";
import { getBookState, setBookStateProperty } from "../core/appState.js";

export async function getWordsData(bookKey) {
  if (bookKey === "a1-b1") {
    const url = "https://docs.google.com/spreadsheets/d/...gid=0...";
    return await fetchWordsFromCsv(url);
  }

  if (bookKey === "b2-c2") {
    const url = "https://docs.google.com/spreadsheets/d/...gid=2053...";
    return await fetchWordsFromCsv(url);
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
