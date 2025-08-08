// js/modules/wordUI.js
// Các hàm hiển thị từ vựng và phát âm.

import { getElement } from "./domHelpers.js";

export const updateWordDisplay = (wordObj) => {
  const wordDisplay = getElement("wordDisplay");
  const posDisplay = getElement("posDisplay");
  const ipaText = getElement("ipaText");

  // Không thao tác với class 'show' nữa
  if (wordObj && wordDisplay && posDisplay && ipaText) {
    wordDisplay.textContent = wordObj.word;
    const wordTypes = wordObj.wordType
      .split(',')
      .map(type => type.trim())
      .filter(type => type !== '');
    posDisplay.textContent = wordTypes.join(', ');
    ipaText.textContent = wordObj.ipa;
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