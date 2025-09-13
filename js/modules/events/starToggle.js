// js/modules/events/starToggle.js
// Xử lý sự kiện bật/tắt đánh dấu sao cho từ vựng hiện tại

import { appState } from "../core/appState.js";
import { renderWord } from "../ui/render.js";
import { supabase } from "../core/config.js";
import { Storage } from "../core/storage.js";

export async function starToggle() {
  const currentWord = appState.words[appState.index];
  if (!currentWord) return;

  const isStarred = appState.starred.has(currentWord.word);

  if (isStarred) {
    // Unstar
    appState.starred.delete(currentWord.word);
    currentWord.starred = false;
  } else {
    // Star
    appState.starred.add(currentWord.word);
    currentWord.starred = true;
  }

  // Always save localStorage
  Storage.saveStarred(appState.starred);

  // Sync Supabase if online
  if (navigator.onLine && appState.user) {
    const words = [...appState.starred];
    await supabase.from("starred_words").upsert({
      user_id: appState.user.id,
      words
    });
  }

  renderWord();
}
