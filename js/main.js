// js/main.js
// Điểm vào cho ứng dụng Zero-EN

import { fetchWordsFromJson, loadUserDataFromFirestore, saveUserDataToFirestore } from "./modules/data/dataService.js";
import { initPage } from "./modules/page/pageInit.js";
import { attachSearchEvent } from "./modules/event/searchEvents.js";
import { observeAuthState } from "./modules/auth/authService.js";
import { setGreeting } from "./modules/auth/authUI.js";
import { redirectTo } from "./modules/core/domHelpers.js";
import { setBookStateProperty, getBookState } from "./modules/core/appState.js";

// Link JSON dữ liệu từ vựng
const bookSources = {
  "a1-b1": "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/3000.json",
  "b2-c2": "https://raw.githubusercontent.com/gjnzero91/Zero-EN/main/data/5000.json"
};

// Tải toàn bộ dữ liệu từ JSON (và cache vào localStorage)
async function ensureAllBookDataLoaded() {
  for (const key of Object.keys(bookSources)) {
    let words = [];
    const localKey = `vocabWords_${key}`;
    const cached = localStorage.getItem(localKey);

    if (cached) {
      try {
        words = JSON.parse(cached);
      } catch {
        words = [];
      }
    }

    if (!words.length) {
      console.log(`📥 Đang tải từ vựng cho ${key}...`);
      words = await fetchWordsFromJson(bookSources[key]);
      if (words.length) {
        localStorage.setItem(localKey, JSON.stringify(words));
        console.log(`✅ Đã lưu ${words.length} từ cho ${key}`);
      }
    } else {
      console.log(`✅ Load từ localStorage: ${words.length} từ cho ${key}`);
    }

    setBookStateProperty(key, "words", words);
  }
}

// Khi DOM đã sẵn sàng
window.addEventListener("DOMContentLoaded", () => {
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) homeBtn.addEventListener("click", () => redirectTo("home.html"));

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (typeof signOutUser === "function") await signOutUser();
      redirectTo("login.html");
    });
  }
});

// Quan sát trạng thái đăng nhập và xử lý
observeAuthState(async (user) => {
  const pageName = window.location.pathname.split("/").pop();

  if (user) {
    // Nếu đang ở login mà đã đăng nhập thì về home
    if (pageName === "login.html") {
      redirectTo("home.html");
      return;
    }

    setGreeting(user.email.split("@")[0]);

    // Tải tiến trình học từ Firestore
    const cloudState = await loadUserDataFromFirestore(user.uid);
    if (cloudState) {
      for (const bookKey of Object.keys(cloudState)) {
        for (const prop in cloudState[bookKey]) {
          setBookStateProperty(bookKey, prop, cloudState[bookKey][prop]);
        }
      }
      console.log("📥 Đã tải tiến trình học từ Firestore");
    } else {
      // Nếu chưa có thì lưu tiến trình mới
      await saveUserDataToFirestore(user.uid, {
        "a1-b1": getBookState("a1-b1"),
        "b2-c2": getBookState("b2-c2"),
        "star": getBookState("star")
      });
      console.log("📤 Tạo mới tiến trình học trên Firestore");
    }

    // Load dữ liệu và khởi tạo trang
    await ensureAllBookDataLoaded();
    initPage(pageName);
    attachSearchEvent();

  } else {
    // Nếu chưa đăng nhập và không ở trang login thì chuyển sang login
    if (pageName !== "login.html") {
      redirectTo("login.html");
    }
  }
});
