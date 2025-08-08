// Zero-EN/js/modules/event/starEvents.js
// Xử lý sự kiện đánh dấu từ yêu thích trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";
import { getBookState, appState } from "../core/appState.js";
import {getStarredWords,starWord,unstarWord,saveUserDataToFirestore } from "../data/dataService.js";
import { getCurrentUser } from "../auth/authService.js";
import { initializeBookData } from "../vocab/vocabData.js";
import { loadWord } from "../vocab/vocabDisplay.js";

export function attachStarEvent(bookKey) {
  const starIcon = getElement("starIcon");
  if (!starIcon) return;

  starIcon.onclick = async () => {
    const bookState = getBookState(bookKey);
    const words = bookState.words;
    if (!words || words.length === 0) return;

    const currentIndex = bookState.shuffleMode
      ? bookState.shuffledIndices[bookState.currentIndex]
      : bookState.currentIndex;

    const currentWordObj = words[currentIndex];
    if (!currentWordObj) return;

    const starredWords = await getStarredWords();
    const isStarred = starredWords.has(currentWordObj.word);

    if (isStarred) {
      await unstarWord(currentWordObj.word);
    } else {
      await starWord(currentWordObj);
    }

    if (bookKey === "star") {
      await initializeBookData("star", true);
    }

    await loadWord(bookKey);

    const user = getCurrentUser();
    if (user) {
      await saveUserDataToFirestore(user.uid, appState);
    } else {
      console.warn("[StarEvents] Không thể lưu dữ liệu vì người dùng chưa đăng nhập.");
    }
  };
}
