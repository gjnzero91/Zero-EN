// Zero-EN/js/modules/vocab/vocabPage.js
// Quản lý trang từ vựng trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";

export const updateWordDisplay = (wordObj) => {
  const wordDisplay = getElement("wordDisplay");
  const posDisplay = getElement("posDisplay");
  const ipaText = getElement("ipaText");

  if (wordObj && wordDisplay && posDisplay && ipaText) {
    wordDisplay.textContent = wordObj.word;
    const wordTypes = typeof wordObj.wordType === "string"
      ? wordObj.wordType.split(',').map(type => type.trim()).filter(type => type !== '')
      : [];
    posDisplay.textContent = wordTypes.join(', ');
    ipaText.textContent = wordObj.ipa || "";
  } else if (wordDisplay && posDisplay && ipaText) {
    wordDisplay.textContent = "No words found.";
    posDisplay.textContent = "";
    ipaText.textContent = "";
  }
};

export const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};

export function setupVocabPage(pageType) {
  const words = JSON.parse(localStorage.getItem(pageType)) || [];
  if (words.length === 0) {
    const wordDisplay = getElement("wordDisplay");
    if (wordDisplay) wordDisplay.textContent = "No data";
    return;
  }

  const firstWord = words[0];
  updateWordDisplay(firstWord);
}
