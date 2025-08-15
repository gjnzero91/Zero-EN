// Zero-EN/js/modules/vocab/customController.js
// Quản lý từ vựng trong trang tùy chỉnh với Supabase

import { 
  loadCustomDataFromSupabase, 
  saveCustomDataToSupabase, 
  fetchWordsFromJson, 
  splitWordsIntoPackages 
} from "../data/dataService.js";

const PACKAGE_SIZE = 10; // có thể thay đổi
let currentLessonIndex = 0;
let allWords = [];
let customPackages = [];

export async function setupCustomVocabPage() {
  const { allWords: storedWords, lastLessonIndex } = await loadCustomDataFromSupabase();

  if (storedWords.length > 0) {
    allWords = storedWords;
    currentLessonIndex = lastLessonIndex;
  } else {
    const a1Words = await fetchWordsFromJson(
      "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/3000.json"
    );
    const b2Words = await fetchWordsFromJson(
      "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/5000.json"
    );
    allWords = [...a1Words, ...b2Words];
    await saveCustomDataToSupabase(allWords, 0);
  }

  customPackages = splitWordsIntoPackages(allWords, PACKAGE_SIZE);
  loadCustomLesson();
}

export function loadCustomLesson(direction = null) {
  if (direction === "next") {
    currentLessonIndex = (currentLessonIndex + 1) % customPackages.length;
  } else if (direction === "prev") {
    currentLessonIndex = (currentLessonIndex - 1 + customPackages.length) % customPackages.length;
  }

  const lessonWords = customPackages[currentLessonIndex];
  console.log(`[Custom] Đang ở bài ${currentLessonIndex + 1}/${customPackages.length}`, lessonWords);

  if (lessonWords?.length > 0) {
    // updateWordDisplay(lessonWords[0]); // Hàm UI hiện tại của bạn
  }

  saveCustomDataToSupabase(allWords, currentLessonIndex);
}
