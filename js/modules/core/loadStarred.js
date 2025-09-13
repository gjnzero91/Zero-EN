// js/modules/core/loadStarred.js
// Load danh sách từ đã gắn sao cho user

import { supabase } from "./config.js";
import { Storage } from "./storage.js";
import { appState } from "./appState.js";

// Load danh sách từ đã gắn sao cho user
export async function loadStarredForUser() {
  if (!appState.user) {
    appState.starred = Storage.loadStarred();
    return;
  }

  // Nếu có mạng, ưu tiên sync với Supabase
  if (navigator.onLine) {
    const { data, error } = await supabase
      .from("starred_words")
      .select("words")
      .eq("user_id", appState.user.id)
      .single();

    if (!error && data?.words) {
      appState.starred = new Set(data.words);
      Storage.saveStarred(appState.starred);
      return;
    }
  }

  // Nếu offline hoặc lỗi Supabase → dùng localStorage
  appState.starred = Storage.loadStarred();
}
