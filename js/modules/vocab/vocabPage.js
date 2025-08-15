// Zero-EN/js/modules/vocab/vocabPage.js
import { getElement } from "../core/domHelpers.js";
import { loadCustomDataFromFirestore as loadCustomDataFromSupabase } from "../data/dataService.js";

export const updateWordDisplay = (wordObj) => {
  const wordDisplay = getElement("wordDisplay");
  const posDisplay = getElement("posDisplay");
  const ipaText = getElement("ipaText");

  if (wordObj && wordDisplay && posDisplay && ipaText) {
    wordDisplay.textContent = wordObj.word;
    const wordTypes = typeof wordObj.wordType === "string"
      ? wordObj.wordType.split(',').map(type => type.trim()).filter(Boolean)
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

export async function setupVocabPage(pageType) {
  let words = [];

  // Thử lấy từ Supabase (nếu đăng nhập)
  try {
    const { allWords } = await loadCustomDataFromSupabase();
    if (allWords.length > 0) {
      words = allWords;
    }
  } catch (err) {
    console.warn("[VocabPage] Lỗi khi tải từ Supabase, fallback localStorage:", err);
  }

  // Nếu không có thì lấy từ localStorage
  if (!words.length) {
    words = JSON.parse(localStorage.getItem(pageType)) || [];
  }

  if (words.length === 0) {
    const wordDisplay = getElement("wordDisplay");
    if (wordDisplay) wordDisplay.textContent = "No data";
    return;
  }

  const firstWord = words[0];
  updateWordDisplay(firstWord);
}
