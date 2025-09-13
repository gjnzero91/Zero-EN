// modules/page/loginPage.js
// Hiển thị trang đăng nhập / đăng ký

import { login } from "../auth/login.js";
import { register } from "../auth/register.js";
import { loginWithGoogle } from "../auth/googleAuth.js";

export function renderLoginPage(root) {
root.innerHTML = `
  <div id="container" class="auth-container">
    <h2>Login / Register</h2>
    <input type="email" id="emailInput" placeholder="Email" />
    <input type="password" id="passwordInput" placeholder="Password" />
    <button id="loginBtn">Login</button>
    <button id="registerBtn">Register</button>
    <button id="googleLoginBtn">Login with Google</button>
    <p id="authMessage"></p>
  </div>
`;

  // Xử lý login
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value.trim();
    const pass = document.getElementById("passwordInput").value.trim();
    try {
      await login(email, pass);
      window.location.hash = "#/home";
    } catch (err) {
      document.getElementById("authMessage").innerText = err.message;
    }
  });

  // Xử lý register
  document.getElementById("registerBtn").addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value.trim();
    const pass = document.getElementById("passwordInput").value.trim();
    try {
      await register(email, pass);
      window.location.hash = "#/home";
    } catch (err) {
      document.getElementById("authMessage").innerText = err.message;
    }
  });

  // Login bằng Google
  document.getElementById("googleLoginBtn")
    .addEventListener("click", loginWithGoogle);
}
