// js/modules/core/loadCustomLessons.js
import { supabase, config } from "./config.js";
import { appState } from "./appState.js";

/**
 * Load custom lessons:
 * 1. Nếu online và user tồn tại => thử lấy từ Supabase (table custom_vocab, cột lessons)
 * 2. Nếu không có / lỗi => thử localStorage cache
 * 3. Cuối cùng fallback fetch local file config.dataset.custom
 *
 * Trả về: Array of lessons (mỗi lesson = array of word objects)
 */
const LS_KEY = "vt_custom_lessons";

export async function loadCustomLessons() {
  // 1) try supabase if online and user
  if (navigator.onLine && appState.user) {
    try {
      const { data, error } = await supabase
        .from("custom_vocab")
        .select("lessons")
        .eq("user_id", appState.user.id)
        .single();
      if (!error && data?.lessons) {
        // save to cache
        try { localStorage.setItem(LS_KEY, JSON.stringify(data.lessons)); } catch (_) {}
        return data.lessons;
      }
    } catch (err) {
      console.warn("loadCustomLessons: supabase read failed:", err);
      // continue to fallback
    }
  }

  // 2) try localStorage cache
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    /* ignore parse errors */
  }

  // 3) fallback: fetch local JSON file (config.dataset.custom)
  try {
    const res = await fetch(config.dataset.custom ?? "data/custom.json", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      // Normalize to "lessons" as array of arrays
      let lessons = json.lessons ?? null;

      if (!lessons) {
        // if the file has packages or words or is already an array of items, convert to lessons
        if (Array.isArray(json.packages)) {
          lessons = json.packages.flat();
        } else if (Array.isArray(json.words)) {
          lessons = json.words;
        } else if (Array.isArray(json)) {
          lessons = json;
        } else {
          lessons = [];
        }
      }

      // If lessons is a flat array of words, chunk it
      if (lessons.length && !Array.isArray(lessons[0])) {
        const size = config.defaultPackageSize ?? 10;
        const chunked = [];
        for (let i = 0; i < lessons.length; i += size) {
          chunked.push(lessons.slice(i, i + size));
        }
        lessons = chunked;
      }

      // cache
      try { localStorage.setItem(LS_KEY, JSON.stringify(lessons)); } catch (_) {}
      return lessons;
    } else {
      console.warn("loadCustomLessons: fetch local file failed", res.status);
    }
  } catch (err) {
    console.warn("loadCustomLessons: fetch error", err);
  }

  // final fallback
  return [];
}
