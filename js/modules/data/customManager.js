// js/modules/data/customManager.js
// Xử lý tải và lưu trữ gói từ vựng custom cho user

import { supabase, config } from "../core/config.js";
import { appState } from "../core/appState.js";

// Utility: chia array thành các gói 10 phần tử
function chunk10(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i += 10) {
    out.push(arr.slice(i, i + 10));
  }
  return out;
}

// Lưu lessons lên Supabase
async function saveLessons(userId, lessons) {
  const { error } = await supabase
    .from("custom_vocab")
    .upsert({ user_id: userId, lessons }, { onConflict: "user_id" });

  if (error) throw error;
}

// Lấy lessons từ Supabase
async function getLessons(userId) {
  const { data, error } = await supabase
    .from("custom_vocab")
    .select("lessons")
    .eq("user_id", userId)
    .single();

  // Nếu không phải lỗi "no rows" thì throw
  if (error && error.code !== "PGRST116") throw error;

  return data?.lessons || null;
}

// Load lessons từ local file custom.json
async function loadLessonsFromLocal() {
  const res = await fetch(config.dataset.custom);
  const data = await res.json();

  if (Array.isArray(data?.lessons)) {
    return data.lessons; // đã chia sẵn theo gói
  }
  if (Array.isArray(data?.customWords)) {
    return chunk10(data.customWords); // chia thủ công
  }
  if (Array.isArray(data?.packages)) {
    return chunk10(data.packages); // dataset chuẩn
  }

  return [];
}

// API chính: load custom lessons
export async function loadCustomLessons() {
  const user = appState.user;

  // Nếu chưa login → dùng file local
  if (!user?.id) {
    return await loadLessonsFromLocal();
  }

  // Thử lấy từ Supabase
  let lessons = await getLessons(user.id);

  // Nếu chưa có thì tạo từ local và lưu lên Supabase
  if (!lessons) {
    lessons = await loadLessonsFromLocal();
    if (lessons.length) {
      await saveLessons(user.id, lessons);
    }
  }

  return lessons;
}
