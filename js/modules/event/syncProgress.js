// Zero-EN/js/modules/event/syncProgress.js
// Đồng bộ tiến trình học của người dùng lên Firestore

import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { db } from "../core/firebaseConfig.js";
import { getCurrentUser } from "../auth/authService.js";
import { appState } from "../core/appState.js";

// Đồng bộ tiến trình học của người dùng lên Firestore
export async function syncProgress() {
  const user = getCurrentUser();

  if (!user) {
    console.warn("[syncProgress] Không thể đồng bộ vì người dùng chưa đăng nhập.");
    return;
  }

  try {
    const progressData = {
      currentBook: appState?.currentBook || null,
      learnedWords: appState?.learnedWords || 0,
      completedLessons: appState?.completedLessons || 0,
      lastSync: serverTimestamp()
    };

    const ref = doc(db, `users/${user.uid}/userData/progress`);
    await setDoc(ref, progressData, { merge: true });

    console.log(
      "[syncProgress] Tiến trình đã được đồng bộ cho user:",
      user.uid,
      progressData
    );
  } catch (error) {
    console.error("[syncProgress] Lỗi khi đồng bộ tiến trình:", error);
  }
}
