// js/modules/state.js
// Quản lý trạng thái ứng dụng và các hàm liên quan.

export let appState = {
  'a1-b1': { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 0 },
  'b2-c2': { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 0 },
  'star':  { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 0 }
};

export const getBookState = (key) => appState[key];

export const setBookStateProperty = (key, prop, value) => {
  appState[key][prop] = value;
};

export const loadLocalState = () => {
  const localState = localStorage.getItem("appState");
  if (localState) {
    appState = JSON.parse(localState);
  }
};

export const saveLocalState = () => {
  localStorage.setItem("appState", JSON.stringify(appState));
};