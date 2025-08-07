// Zero-EN/js/modules/ui/wordUI.js
// Thiết lập giao diện người dùng cho từ vựng trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";

export const updateWordDisplay = (wordObj) => {
  const wordDisplay = getElement("wordDisplay");
  const posDisplay = getElement("posDisplay");
  const ipaText = getElement("ipaText");

  if (wordObj && wordDisplay && posDisplay && ipaText) {
    wordDisplay.textContent = wordObj.word || "[No word]";
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