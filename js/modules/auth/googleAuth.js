// js/modules/auth/googleAuth.js
// Xử lý đăng nhập bằng Google OAuth và redirect sau khi xác thực

import { supabase } from "../core/config.js";
import { appState } from "../core/appState.js";
import { Storage } from "../core/storage.js";

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/home.html"
    }
  });

  if (error) {
    console.error("Google signInWithOAuth error:", error);
    throw error;
  }
}


export async function handleGoogleRedirect() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("getSession error:", error);
      return;
    }

    const session = data?.session;
    if (session?.user) {
      const u = { email: session.user.email, id: session.user.id };
      appState.user = u;
      Storage.saveUser(u);

      const path = window.location.pathname;
      if (path.endsWith("index.html") || path === "/" || path.endsWith("/index.html")) {
        window.location.href = "home.html";
      }
    }
  } catch (err) {
    console.error("handleGoogleRedirect failed:", err);
  }
}
