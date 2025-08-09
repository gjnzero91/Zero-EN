// Zero-EN/js/modules/vocab/customPage.js
// Trang custom để hiển thị gói từ ngẫu nhiên từ cả A1-B2 và B2-C2 (từ GitHub JSON)

import { getElement } from "../core/domHelpers.js";
import { speak } from "../ui/wordUI.js";
import { fetchWordsFromJson } from "../data/dataService.js"; // Hàm mới trong dataService.js

let currentLessonIndex = 0;
let customPackages = [];

const PACKAGE_SIZE = 10;

// Hiển thị 1 gói từ vựng
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

  const currentWord = words[0]; // Hiển thị từ đầu tiên trong gói
  wordDisplay.textContent = currentWord.word;
  posDisplay.textContent = currentWord.wordType;
  ipaText.textContent = currentWord.ipa;

  pronounceBtn.onclick = () => speak(currentWord.word);
};

// Hiển thị bài học tại index
const showLesson = (index) => {
  if (index < 0 || index >= customPackages.length) return;
  console.log("[Custom] Tổng số gói:", customPackages.length);
  console.log("[Custom] Gói 1:", customPackages[0]);
  currentLessonIndex = index;
  displayWords(customPackages[index]);
};

// Hàm khởi tạo trang custom
export const setupCustomPage = async () => {
  // === URL file JSON trên GitHub (Raw) ===
  const a1Url = "https://raw.githubusercontent.com/gjnzero91/Zero-EN/refs/heads/main/data/3000.json";
  const b2Url = "https://raw.githubusercontent.com/gjnzero91/Zero-EN/refs/heads/main/data/5000.json";

  console.log("[Custom] Đang tải dữ liệu từ GitHub...");
  const a1Words = await fetchWordsFromJson(a1Url);
  const b2Words = await fetchWordsFromJson(b2Url);

  // Gộp và xáo trộn
  const allWords = [...a1Words, ...b2Words];
  const shuffled = allWords.sort(() => 0.5 - Math.random());

  // Chia thành từng gói PACKAGE_SIZE
  customPackages = [];
  for (let i = 0; i < shuffled.length; i += PACKAGE_SIZE) {
    customPackages.push(shuffled.slice(i, i + PACKAGE_SIZE));
  }

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
