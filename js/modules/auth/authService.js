// Zero-EN/js/modules/auth/authService.js
// Dịch vụ xác thực (Supabase)

import { supabase } from "../core/supabaseConfig.js";

let cachedUser = null;

export function setAuthMessage(message) {
  const el = document.getElementById("authMessage");
  if (el) el.textContent = message;
}

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  cachedUser = data.user;
  return data.user;
};

export const registerUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  // Có thể cần xác minh email tùy config
  return data.user;
};

export const loginWithGoogle = async () => {
  const redirectTo = `${location.origin}/home.html`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo }
  });
  if (error) throw error;
  // Trình duyệt sẽ chuyển hướng theo redirectTo
  return data;
};

export const signOutUser = async () => {
  await supabase.auth.signOut();
  cachedUser = null;
};

export const observeAuthState = (callback) => {
  // Gọi ngay trạng thái hiện tại
  supabase.auth.getUser().then(({ data }) => {
    cachedUser = data?.user ?? null;
    callback(cachedUser);
  });
  // Lắng nghe thay đổi
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    cachedUser = session?.user ?? null;
    callback(cachedUser);
  });
  return sub; // nếu cần unsubscribe: sub.subscription.unsubscribe()
};

export const getCurrentUser = () => cachedUser;
