// Zero-EN/js/modules/vocab/customPage.js
// Trang custom để hiển thị gói từ ngẫu nhiên từ cả A1-B2 và B2-C2

import { getElement } from "../core/domHelpers.js";
import { loadCustomPackagesFromFirestore } from "../data/dataService.js";
import { speak } from "../ui/wordUI.js";

let currentLessonIndex = 0;
let customPackages = [];

// ==== Hiển thị 1 gói từ vựng ====
const displayWords = (words) => {
  const wordDisplay = getElement("wordDisplay");
  const posDisplay = getElement("posDisplay");
  const ipaText = getElement("ipaText");
  const pronounceBtn = getElement("pronounce");

  if (!words || words.length === 0) {
    wordDisplay.textContent = "No words available";
    posDisplay.textContent = "";
    ipaText.textContent = "";
    return;
  }

  const currentWord = words[0]; // từ đầu tiên trong gói
  wordDisplay.textContent = currentWord.word;
  posDisplay.textContent = currentWord.wordType;
  ipaText.textContent = currentWord.ipa;

  pronounceBtn.onclick = () => speak(currentWord.word);
};

// ==== Hiển thị bài học tại index ====
const showLesson = (index) => {
  if (index < 0 || index >= customPackages.length) return;
  currentLessonIndex = index;
  console.log(`[Custom] Hiển thị gói ${index + 1}/${customPackages.length}`);
  displayWords(customPackages[index]);
};

// ==== Khởi tạo trang Custom ====
export const setupCustomPage = async () => {
  // Tải hoặc tự tạo packages từ Firestore
  customPackages = await loadCustomPackagesFromFirestore();
  console.log("[Custom] Packages nhận được:", customPackages);

  if (!customPackages || customPackages.length === 0) {
    alert("No packages to display.");
    return;
  }

  // Sự kiện chuyển bài học
  getElement("nextLesson")?.addEventListener("click", () => {
    if (currentLessonIndex < customPackages.length - 1) {
      showLesson(currentLessonIndex + 1);
    }
  });

  getElement("prevLesson")?.addEventListener("click", () => {
    if (currentLessonIndex > 0) {
      showLesson(currentLessonIndex - 1);
    }
  });

  // Hiển thị gói đầu tiên
  showLesson(0);
};
