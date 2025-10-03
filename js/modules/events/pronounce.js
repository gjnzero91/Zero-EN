// js/modules/events/pronounceBt.js
// Xử lý sự kiện phát âm từ vựng sử dụng Web Speech API

export function setupPronounceButton(wordSelector = "#wordDisplay", btnSelector = "#pronounce") {
  const btn = document.querySelector(btnSelector);
  if (!btn) return;
  btn.addEventListener("click", () => {
    const word = document.querySelector(wordSelector)?.textContent;
    if (!word || word === "Loading..." || word === "No words") return;
    const utter = new window.SpeechSynthesisUtterance(word);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  });
}