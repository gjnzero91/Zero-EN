// Zero-EN/js/modules/vocab/vocabNavigate.js
// Xử lý điều hướng từ vựng trong ứng dụng Zero-EN

import { getBookState, setBookStateProperty } from "../core/appState.js";
import { loadWord } from "./vocabDisplay.js";
import { saveLocalState } from "../core/localStorage.js";

export async function goToNextWord(bookKey) {
  const bookState = getBookState(bookKey);
  if (!bookState?.words?.length) return;

  let newIndex = bookState.currentIndex + 1;
  if (newIndex >= bookState.words.length) newIndex = 0;

  setBookStateProperty(bookKey, "currentIndex", newIndex);
  await loadWord(bookKey);
  saveLocalState();
}

export async function goToPrevWord(bookKey) {
  const bookState = getBookState(bookKey);
  if (!bookState?.words?.length) return;

  let newIndex = bookState.currentIndex - 1;
  if (newIndex < 0) newIndex = bookState.words.length - 1;

  setBookStateProperty(bookKey, "currentIndex", newIndex);
  await loadWord(bookKey);
  saveLocalState();
}
