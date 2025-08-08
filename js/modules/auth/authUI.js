//  Zero-EN/js/modules/auth/authUI.js
// Giao diện người dùng cho xác thực trong ứng dụng Zero-EN

import { getElement, redirectTo } from "../core/domHelpers.js";

export const setAuthMessage = (message) => {
  const authMessageElement = getElement("authMessage");
  if (authMessageElement) authMessageElement.textContent = message;
};

export const setGreeting = (name) => {
  const greetingElement = getElement("userName");

  // 👇 Nếu name là email → cắt phần trước @
  const shortName = name.includes("@") ? name.split("@")[0] : name;

  if (greetingElement) {
    greetingElement.textContent = `Hi, ${shortName}!`;
    console.log(`[authUI] Đã đặt tên người dùng: Hi, ${shortName}!`);
  } else {
    console.warn("[authUI] Không tìm thấy phần tử 'userName' để hiển thị lời chào.");
  }
};
