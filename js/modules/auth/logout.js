// js/modules/auth/logout.js
// Xử lý đăng xuất và chuyển về trang index.html

import { supabase } from "../core/config.js";
import { Storage } from "../core/storage.js";

export async function logout() {
  await supabase.auth.signOut();
  Storage.clearUser();
  window.location.href = "index.html";
}
