// Zero-EN/js/modules/vocab/customController.js
// Quản lý từ vựng trong trang tùy chỉnh

import { 
  loadCustomPackagesFromFirestore, 
  saveCustomPackagesToFirestore, 
  fetchWordsFromJson 
} from "../data/dataService.js";
import { getElement } from "../core/domHelpers.js";
import { updateWordDisplay } from "../ui/wordUI.js";
import { updateProgressBar } from "../ui/progressUI.js";

let currentLessonIndex = 0;
let customPackages = [];

export async function setupCustomVocabPage() {
  // 1. Thử tải từ Firestore trước
  customPackages = await loadCustomPackagesFromFirestore();

  if (!customPackages || customPackages.length === 0) {
    console.warn("[Custom] No data in Firestore → Creating new packages...");

    // 2. Tải từ JSON GitHub
    const a1Words = await fetchWordsFromJson("https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/3000.json");
    const b2Words = await fetchWordsFromJson("https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/5000.json");

    console.log("[Custom] a1Words length:", a1Words.length);
    console.log("[Custom] b2Words length:", b2Words.length);

    if (!Array.isArray(a1Words) || !Array.isArray(b2Words)) {
      console.error("[Custom] Lỗi: Dữ liệu tải về không phải mảng hợp lệ.");
      alert("Không thể tải dữ liệu từ vựng.");
      return;
    }

    // 3. Gộp thành packages (mỗi level 1 package)
    customPackages = [a1Words, b2Words];

    // 4. Lưu vào Firestore để lần sau dùng
    await saveCustomPackagesToFirestore(customPackages);
  }

  // 5. Hiển thị lesson đầu tiên
  currentLessonIndex = 0;
  loadCustomLesson();
}

export function loadCustomLesson(direction = null) {
  if (!customPackages || customPackages.length === 0) return;

  if (direction === "next") {
    currentLessonIndex = (currentLessonIndex + 1) % customPackages.length;
  } else if (direction === "prev") {
    currentLessonIndex = (currentLessonIndex - 1 + customPackages.length) % customPackages.length;
  }

  const lessonWords = customPackages[currentLessonIndex];

  const firstWord = lessonWords[0];
  if (firstWord) {
    updateWordDisplay(firstWord);
    updateProgressBar(getElement("progressBar"), {
      currentIndex: 0,
      words: lessonWords
    });
  }
}
