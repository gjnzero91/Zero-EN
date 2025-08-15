// Zero-EN/js/modules/data/dataService.js
// Quản lý dữ liệu từ Supabase Postgres + GitHub JSON

import { supabase } from "../core/supabaseConfig.js";
import { getCurrentUser } from "../auth/authService.js";

/* ==== Lấy dữ liệu JSON từ GitHub Raw ==== */
export const fetchWordsFromJson = async (url) => {
  try {
    const response = await fetch(url);
    console.log("[JSON] Fetching:", url, "Status:", response.status);
    if (!response.ok) throw new Error("HTTP " + response.status);

    const data = await response.json();
    let result = [];

    if (Array.isArray(data)) {
      result = data;
    } else if (Array.isArray(data.packages)) {
      // { packages: [...] }
      result = data.packages;
    } else if (Array.isArray(data.words)) {
      // { words: [...] }
      result = data.words;
    } else if (data && typeof data === "object") {
      // Lấy mảng đầu tiên trong object
      const firstArray = Object.values(data).find(v => Array.isArray(v));
      if (firstArray) result = firstArray;
    }

    console.log("[JSON] Tổng từ tải được:", result.length);
    return result;
  } catch (error) {
    console.error("[JSON] Lỗi khi tải:", error);
    return [];
  }
};

/* ==== Starred words ==== */
export const starWord = async (wordObj) => {
  const user = getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const payload = {
    user_id: user.id,
    word: wordObj.word,
    word_type: wordObj.wordType ?? null,
    ipa: wordObj.ipa ?? null
  };
  const { error } = await supabase
    .from('starred_words')
    .upsert(payload, { onConflict: 'user_id,word' });
  if (error) throw error;
};

export const unstarWord = async (word) => {
  const user = getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const { error } = await supabase
    .from('starred_words')
    .delete()
    .eq('user_id', user.id)
    .eq('word', word);
  if (error) throw error;
};

export const getStarredWords = async () => {
  const user = getCurrentUser();
  if (!user) return new Set();
  const { data, error } = await supabase
    .from('starred_words')
    .select('word')
    .eq('user_id', user.id);
  if (error) {
    console.error("getStarredWords error:", error);
    return new Set();
  }
  return new Set((data || []).map(r => r.word));
};

export const getStarredWordsData = async () => {
  const user = getCurrentUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('starred_words')
    .select('word, word_type, ipa')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error("getStarredWordsData error:", error);
    return [];
  }
  return (data || []).map(r => ({
    word: r.word,
    wordType: r.word_type || "",
    ipa: r.ipa || ""
  }));
};

/* ==== User appState (tiến trình học) ==== */
export const loadUserDataFromFirestore = async (_uid) => {
  const user = getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('user_app_state')
    .select('app_state')
    .eq('user_id', user.id)
    .single();
  if (error && error.code !== 'PGRST116') { // not found
    console.error("loadUserData error:", error);
    return null;
  }
  return data?.app_state ?? null;
};

export const saveUserDataToFirestore = async (_uid, appState) => {
  const user = getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const payload = {
    user_id: user.id,
    app_state: appState,
    updated_at: new Date().toISOString()
  };
  const { error } = await supabase
    .from('user_app_state')
    .upsert(payload);
  if (error) throw error;
};

/* ==== Custom data: allWords + lastLessonIndex ==== */
export const saveCustomDataToFirestore = async (allWords, lastLessonIndex = 0) => {
  const user = getCurrentUser();
  if (!user) {
    console.warn("saveCustomDataToFirestore: Chưa đăng nhập.");
    return;
  }
  const payload = {
    user_id: user.id,
    all_words: allWords,              // mảng JSONB lớn
    last_lesson_index: lastLessonIndex,
    updated_at: new Date().toISOString()
  };
  const { error } = await supabase
    .from('user_custom_data')
    .upsert(payload);
  if (error) {
    console.error("[Custom] Lỗi khi lưu custom data:", error);
  }
};

export const loadCustomDataFromFirestore = async () => {
  const user = getCurrentUser();
  if (!user) {
    console.warn("loadCustomDataFromFirestore: Chưa đăng nhập.");
    return { allWords: [], lastLessonIndex: 0 };
  }
  const { data, error } = await supabase
    .from('user_custom_data')
    .select('all_words, last_lesson_index')
    .eq('user_id', user.id)
    .single();
  if (error && error.code !== 'PGRST116') {
    console.error("[Custom] Lỗi khi tải custom data:", error);
    return { allWords: [], lastLessonIndex: 0 };
  }
  return {
    allWords: Array.isArray(data?.all_words) ? data.all_words : [],
    lastLessonIndex: data?.last_lesson_index ?? 0
  };
};

/* ==== Chia mảng thành các gói nhỏ ==== */
export const splitWordsIntoPackages = (allWords, packageSize) => {
  const packages = [];
  for (let i = 0; i < allWords.length; i += packageSize) {
    packages.push(allWords.slice(i, i + packageSize));
  }
  return packages;
};
