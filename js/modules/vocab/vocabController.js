// Zero-EN/js/modules/vocab/vocabController.js
// Quản lý từ vựng trong ứng dụng Zero-EN

import { observeAuthState } from "../auth/authService.js";
import { redirectTo } from "../core/domHelpers.js";
import { loadBook } from "./vocabData.js";
import { setupVocabEvents } from "../event/vocabEvents.js";
import { loadLocalState } from "../core/localStorage.js";
import { setGreeting } from "../auth/authUI.js";

export function setupVocabPage(bookKey) {
  loadLocalState();

  observeAuthState(async (user) => {
    if (bookKey === "star" && !user) {
      redirectTo("login.html");
      return;
    }

    if (user) {
      // Với Supabase, user.email là bắt buộc có
      setGreeting(user.email || "User");
    }

    await loadBook(bookKey);
    setupVocabEvents(bookKey);
  });
}