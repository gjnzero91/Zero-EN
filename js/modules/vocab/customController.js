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

const PACKAGE_SIZE = 10;
let currentLessonIndex = 0;
let customPackages = [];

export async function setupCustomVocabPage() {
  // 1. Tải gói từ Firestore
  customPackages = await loadCustomPackagesFromFirestore();

  // 2. Nếu Firestore rỗng → tạo mới từ JSON
  if (!customPackages || customPackages.length === 0) {
    console.log("[Custom] No data in Firestore → Creating new packages...");
    const a1Words = await fetchWordsFromJson(
      "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/3000.json"
    );
    const b2Words = await fetchWordsFromJson(
      "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/5000.json"
    );

    console.log("[Custom] a1Words length:", a1Words.length);
    console.log("[Custom] b2Words length:", b2Words.length);

    const allWords = [...a1Words, ...b2Words];
    const shuffled = allWords.sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffled.length; i += PACKAGE_SIZE) {
      customPackages.push(shuffled.slice(i, i + PACKAGE_SIZE));
    }

    // Lưu gói mới lên Firestore
    await saveCustomPackagesToFirestore(customPackages);
    console.log("[Custom] Saved new packages to Firestore");
  }

  // 3. Nếu vẫn không có dữ liệu thì báo lỗi
  if (!customPackages || customPackages.length === 0) {
    alert("Không có gói từ nào.");
    return;
  }

  // 4. Bắt đầu hiển thị bài học đầu tiên
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

  // Hiển thị từ đầu tiên của gói
  const firstWord = lessonWords[0];
  if (firstWord) {
    updateWordDisplay(firstWord);
    updateProgressBar(getElement("progressBar"), {
      currentIndex: 0,
      words: lessonWords
    });
  }
}
