// Zero-EN/js/modules/auth/authEvents.js
// Xử lý các sự kiện liên quan đến xác thực người dùng (Supabase)

import { loginUser, registerUser, loginWithGoogle } from "./authService.js";
import { getElement, redirectTo } from "../core/domHelpers.js";
import { setAuthMessage } from "./authUI.js"; // đổi sang authUI, vì setAuthMessage không nên ở authService

export const setupLoginEventListeners = () => {
  const emailInput = getElement("emailInput");
  const passwordInput = getElement("passwordInput");
  const loginBtn = getElement("loginBtn");
  const registerBtn = getElement("registerBtn");
  const googleLoginBtn = getElement("googleLoginBtn");

  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      try {
        await registerUser(email, password);
        setAuthMessage("Đăng ký thành công! Vui lòng đăng nhập.");
      } catch (error) {
        setAuthMessage(error.message);
      }
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      try {
        await loginUser(email, password);
        setAuthMessage("Đăng nhập thành công! Đang chuyển hướng...");
        redirectTo("home.html");
      } catch (error) {
        setAuthMessage(error.message);
      }
    });
  }

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      try {
        await loginWithGoogle();
        setAuthMessage("Đăng nhập Google thành công! Đang chuyển hướng...");
        redirectTo("home.html");
      } catch (error) {
        setAuthMessage(error.message);
      }
    });
  }
};
