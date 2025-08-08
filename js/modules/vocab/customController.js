// Zero-EN/js/modules/vocab/customController.js
// Quản lý từ vựng trong trang tùy chỉnh

import { loadCustomPackagesFromFirestore } from "../data/dataService.js";
import { getElement } from "../core/domHelpers.js";
import { updateWordDisplay } from "../ui/wordUI.js";
import { updateProgressBar } from "../ui/progressUI.js";

let currentLessonIndex = 0;
let customPackages = [];

export async function setupCustomVocabPage() {
  customPackages = await loadCustomPackagesFromFirestore();
  if (!customPackages || customPackages.length === 0) {
    alert("Không có gói từ nào.");
    return;
  }

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
