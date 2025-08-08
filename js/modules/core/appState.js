// Zero-EN/js/modules/core/appState.js
// Quản lý trạng thái ứng dụng Zero-EN

export const appState = {
  'a1-b1': { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 10, countdownActive: false },
  'b2-c2': { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 10, countdownActive: false },
  'star':  { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 10, countdownActive: false }
};

export const getBookState = (key) => appState[key];

export const setBookStateProperty = (key, prop, value) => {
  appState[key][prop] = value;
};

export function saveLocalState() {
  localStorage.setItem("bookState", JSON.stringify(appState));
}