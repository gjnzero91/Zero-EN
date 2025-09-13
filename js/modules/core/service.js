// js/modules/core/service.js
// Điều phối load/save từ đã gắn sao giữa Supabase và localStorage

import { supabase } from "./config.js";
import { Storage } from "./storage.js";

export const StarredService = {
  async load(userId) {
    // Ưu tiên Supabase
    const { data, error } = await supabase
      .from("starred_words")
      .select("words")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      console.warn("Supabase load failed, using localStorage:", error?.message);
      return Storage.loadStarred();
    }

    const starredSet = new Set(data.words || []);
    Storage.saveStarred(starredSet);
    Storage.markSynced();
    return starredSet;
  },

  async save(userId, starredSet) {
    // Lưu local và đánh dấu cần sync
    Storage.saveStarred(starredSet);

    // Nếu có userId và online thì sync Supabase
    if (navigator.onLine && userId) {
      const { error } = await supabase
        .from("starred_words")
        .upsert({
          user_id: userId,
          words: [...starredSet],
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error("❌ Supabase sync failed:", error.message);
      } else {
        console.log("✅ Supabase sync successful");
        Storage.markSynced();
      }
    }
  },

  async syncIfPending(userId) {
    if (Storage.isPendingSync() && navigator.onLine && userId) {
      const starred = Storage.loadStarred();
      await this.save(userId, starred);
    }
  }
};
