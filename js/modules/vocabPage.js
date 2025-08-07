// Khi load trang, kiểm tra có searchTarget không
const searchTarget = localStorage.getItem("searchTarget");
if (searchTarget) {
  try {
    const { key, idx } = JSON.parse(searchTarget);
    // Nếu đúng trang và có dữ liệu, chuyển đến từ cần tìm
    if (key === bookKey) {
      setBookStateProperty(bookKey, "currentIndex", idx);
      localStorage.removeItem("searchTarget");
    }
  } catch (e) {}
}
// js/modules/vocabPage.js
// Logic cho trang từ vựng (A1-B1, B2-C2, Star).

import {
  fetchWordsFromCsv, starWord, getStarredWords, getStarredWordsData,
  unstarWord, saveUserDataToFirestore
} from "./dataService.js";
import { getElement } from "./domHelpers.js";
import { updateWordDisplay, speak } from "./wordUI.js";
import { updateProgressBar, updateStarIcon } from "./progressUI.js";
import {
  appState, getBookState, setBookStateProperty,
  loadLocalState, saveLocalState
} from "./state.js";
import { getCurrentUser } from "./authService.js";
console.log("[DEBUG] Current user at init:", getCurrentUser());
import { setupHomeEventListeners } from "./homeEvents.js";

// Lấy dữ liệu từ vựng cho từng loại trang
const getWordsData = async (bookKey) => {
  if (bookKey === 'a1-b1') {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=0&single=true&output=csv";
    return await fetchWordsFromCsv(url);
  }
  if (bookKey === 'b2-c2') {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=2053150601&single=true&output=csv";
    return await fetchWordsFromCsv(url);
  }
  if (bookKey === 'star') {
    return await getStarredWordsData();
  }
  return [];
};

// Khởi tạo dữ liệu nếu chưa có hoặc cần làm mới (trang star)
const initializeBookData = async (bookKey) => {
  let words = [];
  if (bookKey === 'star') {
    words = await getStarredWordsData();
  } else {
    words = await getWordsData(bookKey);
  }
  setBookStateProperty(bookKey, 'words', words);
  console.log("Words loaded:", words);
  return words;
};

// Hiển thị từ vựng hiện tại
const loadBook = async (bookKey) => {
  const bookState = getBookState(bookKey);
  const words = bookState.words || [];
  if (words.length === 0) {
    updateWordDisplay(null);
    updateProgressBar(getElement("progressBar"), bookState);
    updateStarIcon(getElement("starIcon"), "", new Set());
    return;
  }
  const currentIndex = bookState.shuffleMode
    ? bookState.shuffledIndices[bookState.currentIndex]
    : bookState.currentIndex;
  const wordObj = words[currentIndex];
  updateWordDisplay(wordObj);

  if (wordObj && wordObj.word) speak(wordObj.word);
  const starredWords = await getStarredWords();
  updateStarIcon(getElement("starIcon"), wordObj.word, starredWords);

  updateProgressBar(getElement("progressBar"), bookState);
  saveLocalState();
  const user = getCurrentUser();
  if (user) saveUserDataToFirestore(user.uid, appState);
};

export const setupVocabPage = async (bookKey) => {
  setupHomeEventListeners();
  loadLocalState();
  const user = getCurrentUser();
  if (user) {
    const firestoreState = await loadUserDataFromFirestore(user.uid);
    if (firestoreState) {
      Object.assign(appState, firestoreState);
    }
  }

  await initializeBookData(bookKey);
  await loadBook(bookKey);

  // UI event listeners
  const pronounceBtn = getElement("pronounce");
  const wordDisplay = getElement("wordDisplay");
  const nextBtn = getElement("next");
  const prevBtn = getElement("prev");
  const starIcon = getElement("starIcon");
  const shuffleToggle = getElement("shuffleToggle");

  if (pronounceBtn) {
    pronounceBtn.onclick = () => {
      const bookState = getBookState(bookKey);
      const wordObj = bookState.words[bookState.currentIndex];
      speak(wordObj.word);
    };
  }
  if (wordDisplay) {
    wordDisplay.onclick = () => {
      const bookState = getBookState(bookKey);
      const word = bookState.words[bookState.currentIndex].word;
      window.open(`https://dictionary.cambridge.org/dictionary/english/${word}`, '_blank');
    };
  }
  if (nextBtn) {
    nextBtn.onclick = async () => {
      const bookState = getBookState(bookKey);
      const newIndex = (bookState.currentIndex + 1) % bookState.words.length;
      setBookStateProperty(bookKey, 'currentIndex', newIndex);
      await loadBook(bookKey);
    };
  }
  if (prevBtn) {
    prevBtn.onclick = async () => {
      const bookState = getBookState(bookKey);
      const newIndex = (bookState.currentIndex - 1 + bookState.words.length) % bookState.words.length;
      setBookStateProperty(bookKey, 'currentIndex', newIndex);
      await loadBook(bookKey);
    };
  }
  if (starIcon) {
    starIcon.onclick = async () => {
      const bookState = getBookState(bookKey);
      const words = bookState.words;
      if (!words.length) return;
      const currentIndex = bookState.shuffleMode
        ? bookState.shuffledIndices[bookState.currentIndex]
        : bookState.currentIndex;
      const currentWordObj = words[currentIndex];
      if (!currentWordObj) return;
      const starredWords = await getStarredWords();
      const isStarred = starredWords.has(currentWordObj.word);
      if (isStarred) {
        await unstarWord(currentWordObj.word);
      } else {
        await starWord(currentWordObj);
      }
      if (bookKey === 'star') {
        await initializeBookData('star');
      }
      await loadBook(bookKey);
    };
  }
  if (shuffleToggle) {
    shuffleToggle.onclick = async () => {
      const bookState = getBookState(bookKey);
      const newShuffleMode = !bookState.shuffleMode;
      setBookStateProperty(bookKey, 'shuffleMode', newShuffleMode);
      shuffleToggle.classList.toggle('active', newShuffleMode);
      if (newShuffleMode) {
        const indices = Array.from({ length: bookState.words.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        setBookStateProperty(bookKey, 'shuffledIndices', indices);
        setBookStateProperty(bookKey, 'currentIndex', 0);
      } else {
        setBookStateProperty(bookKey, 'shuffledIndices', []);
        setBookStateProperty(bookKey, 'currentIndex', 0);
      }
      await loadBook(bookKey);
    };
  }
};