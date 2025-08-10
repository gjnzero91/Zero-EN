import { getElement } from "../core/domHelpers.js";
import { fetchWordsFromJson, saveCustomPackagesToFirestore, loadCustomPackagesFromFirestore } from "../data/dataService.js";
import { speak } from "../ui/wordUI.js";

const PACKAGE_SIZE = 10;
let currentLessonIndex = 0;
let customPackages = [];

export const setupCustomPage = async () => {
  // Thử tải các gói từ Firestore
  customPackages = await loadCustomPackagesFromFirestore();

  // Nếu chưa có thì tạo mới từ JSON và lưu lại
  if (!customPackages || customPackages.length === 0) {
    console.log("[Custom] Creating new packages...");
const a1Words = await fetchWordsFromJson(
    "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/3000.json"
  );
  const b2Words = await fetchWordsFromJson(
    "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/5000.json"
  );

    const allWords = [...a1Words, ...b2Words];
    const shuffled = allWords.sort(() => 0.5 - Math.random());

    for (let i = 0; i < shuffled.length; i += PACKAGE_SIZE) {
      customPackages.push(shuffled.slice(i, i + PACKAGE_SIZE));
    }

    await saveCustomPackagesToFirestore(customPackages);
  }

  if (!customPackages || customPackages.length === 0) {
    alert("No packages to display.");
    return;
  }

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

  showLesson(0);
};
