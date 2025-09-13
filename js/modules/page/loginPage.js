// modules/page/loginPage.js
// Hiển thị trang đăng nhập / đăng ký

import { login } from "../auth/login.js";
import { register } from "../auth/register.js";
import { loginWithGoogle } from "../auth/googleAuth.js";

export function renderLoginPage(root) {
  root.innerHTML = `
    <div class="auth-container">
      <h2>Login / Register</h2>
      <input type="email" id="emailInput" placeholder="Email" />
      <input type="password" id="passwordInput" placeholder="Password" />
      <button id="loginBtn">Login</button>
      <button id="registerBtn">Register</button>
      <button id="googleLoginBtn">Login with Google</button>
      <p id="authMessage"></p>
    </div>
  `;

  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value;
    const pass = document.getElementById("passwordInput").value;
    try {
      await login(email, pass);
      window.location.hash = "#/home";
    } catch (err) {
      document.getElementById("authMessage").innerText = err.message;
    }
  });

  document.getElementById("registerBtn").addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value;
    const pass = document.getElementById("passwordInput").value;
    try {
      await register(email, pass);
      window.location.hash = "#/home";
    } catch (err) {
      document.getElementById("authMessage").innerText = err.message;
    }
  });

  document.getElementById("googleLoginBtn")
    .addEventListener("click", loginWithGoogle);
}
