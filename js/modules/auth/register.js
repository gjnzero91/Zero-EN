// js/modules/auth/register.js
// Xử lý đăng ký tài khoản mới bằng email/password và redirect sau khi đăng ký

import { supabase } from "../core/config.js";
import { appState } from "../core/appState.js";
import { Storage } from "../core/storage.js";

// Đăng ký tài khoản mới bằng email/password
export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // Supabase có thể yêu cầu xác nhận email (tùy config project)
  const user = { email: data.user?.email, id: data.user?.id };
  if (user.email) {
    appState.user = user;
    Storage.saveUser(user);
  }

  // Sau đăng ký → đưa về home.html (hoặc index.html nếu bạn muốn confirm email trước)
  window.location.href = "home.html";
}
