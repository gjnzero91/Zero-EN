// js/modules/ui/render.js
import { appState } from "../core/appState.js";
import { updateProgressBar } from "../events/progressBar.js";
import { saveProgress } from "../core/progress.js";
import { updateIcons } from "./updateIcons.js";

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

export function bindPronounceButton() {
  const btn = document.getElementById("pronounce");
  if (!btn) return;
  btn.onclick = () => {
    const current = appState.words[appState.index];
    if (current?.word) speak(current.word);
  };
}

export function renderWord() {
  const wordEl = document.getElementById("wordDisplay");
  const posEl  = document.getElementById("posDisplay");
  const ipaTxt = document.getElementById("ipaText");

  const item = appState.words[appState.index];
  if (!item) {
    wordEl.textContent = "No data";
    posEl.textContent = "";
    ipaTxt.textContent = "";
    return;
  }

  wordEl.textContent = item.word || "";

  // Click vào từ để mở Cambridge Dictionary
  if (item.word) {
    wordEl.style.cursor = "pointer";
    wordEl.onclick = () => {
      const url = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(item.word)}`;
      window.open(url, "_blank");
    };
  } else {
    wordEl.onclick = null;
    wordEl.style.cursor = "default";
  }

  // Lấy pos
  const pos = item.pos || item.wordType || item.partOfSpeech || "";
  posEl.textContent = pos ? `(${pos})` : "";

  ipaTxt.textContent = item.ipa || item.pronunciation || "";

  // Auto pronounce
  if (item.word) {
    const utter = new SpeechSynthesisUtterance(item.word);
    utter.lang = "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }

  // Progress
  updateProgressBar("progressBar", appState.visitedCount, appState.words.length);

  // 🔄 Cập nhật icon trạng thái
  updateIcons();

  // 💾 Lưu tiến độ học hiện tại
  saveProgress();
}
