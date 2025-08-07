// Zero-EN/js/modules/auth/authEvents.js
// Xử lý các sự kiện liên quan đến xác thực người dùng.

import { loginUser, registerUser, loginWithGoogle } from "./authService.js";
import { getElement, redirectTo } from "../core/domHelpers.js";
import { setAuthMessage } from "../auth/authService.js";

export const setupLoginEventListeners = () => {
  const emailInput = getElement("emailInput");
  const passwordInput = getElement("passwordInput");
  const loginBtn = getElement("loginBtn");
  const registerBtn = getElement("registerBtn");
  const googleLoginBtn = getElement("googleLoginBtn");

  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      const email = emailInput.value;
      const password = passwordInput.value;
      try {
        await registerUser(email, password);
        setAuthMessage("Registered successfully! Please log in.");
      } catch (error) {
        setAuthMessage(error.message);
      }
    });
  }
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = emailInput.value;
      const password = passwordInput.value;
      try {
        await loginUser(email, password);
        setAuthMessage("Logged in successfully! Redirecting...");
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
        setAuthMessage("Logged in with Google! Redirecting...");
        redirectTo("home.html");
      } catch (error) {
        setAuthMessage(error.message);
      }
    });
  }
};