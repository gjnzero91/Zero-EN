// Zero-EN/js/modules/auth/login.js
// Xử lý đăng nhập bằng email/password và kiểm tra trạng thái đăng nhập

import { supabase } from "../core/config.js";
import { appState } from "../core/appState.js";
import { Storage } from "../core/storage.js";

// Đăng nhập bằng email/password
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const user = { email: data.user.email, id: data.user.id };
  appState.user = user;
  Storage.saveUser(user);

  // Sau login → chuyển thẳng về SPA home
  window.location.hash = "#/home";
}

// Nếu user đã login trước đó thì tự động redirect về home
export async function checkExistingLogin() {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    const u = { email: data.session.user.email, id: data.session.user.id };
    appState.user = u;
    Storage.saveUser(u);

    // Nếu đang ở index hoặc login thì đưa về home
    if (!window.location.hash || window.location.hash === "#/login") {
      window.location.hash = "#/home";
    }
  }
}
