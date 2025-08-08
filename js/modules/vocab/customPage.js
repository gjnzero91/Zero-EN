// Zero-EN/js/modules/vocab/customPage.js
// Trang custom để hiển thị gói từ ngẫu nhiên từ cả A1-B2 và B2-C2

import { getElement } from "../core/domHelpers.js";
import { fetchWordsFromCsv, saveCustomPackagesToFirestore, loadCustomPackagesFromFirestore } from "../data/dataService.js";
import { speak } from "../ui/wordUI.js";

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
  
  // Thử tải các gói từ Firestore
  customPackages = await loadCustomPackagesFromFirestore();

  // Nếu chưa có thì tạo mới từ CSV và lưu lại
  if (!customPackages || customPackages.length === 0) {
    console.log("[Custom] Creating new packages...");
    const a1Words = await fetchWordsFromCsv("https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=0&single=true&output=csv");
    const b2Words = await fetchWordsFromCsv("https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=2053150601&single=true&output=csv");

    const allWords = [...a1Words, ...b2Words];
    const shuffled = allWords.sort(() => 0.5 - Math.random());

    for (let i = 0; i < shuffled.length; i += PACKAGE_SIZE) {
      customPackages.push(shuffled.slice(i, i + PACKAGE_SIZE));
    }

    // Lưu gói từ mới tạo lên Firestore
    await saveCustomPackagesToFirestore(customPackages);
  }

  // Kiểm tra nếu vẫn không có dữ liệu sau khi tạo
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
