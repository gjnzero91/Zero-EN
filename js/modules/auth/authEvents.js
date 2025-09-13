// js/modules/auth/authEvents.js
// Thiết lập các event listener cho login, register, Google OAuth

import { login, checkExistingLogin } from "./login.js";
import { register } from "./register.js";
import { loginWithGoogle, handleGoogleRedirect } from "./googleAuth.js";

export function setupLoginEventListeners() {
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const msg = document.getElementById("authMessage");

  document.getElementById("loginBtn")?.addEventListener("click", async () => {
    try {
      await login(emailInput.value, passwordInput.value);
    } catch (err) {
      msg.textContent = "❌ Login failed: " + err.message;
    }
  });

  document.getElementById("registerBtn")?.addEventListener("click", async () => {
    try {
      await register(emailInput.value, passwordInput.value);
    } catch (err) {
      msg.textContent = "❌ Register failed: " + err.message;
    }
  });

  document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      msg.textContent = "❌ Google login failed: " + err.message;
    }
  });
}

export async function checkExistingLoginOnLoad() {
  await handleGoogleRedirect();
  await checkExistingLogin();
}
