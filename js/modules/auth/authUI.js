// Zero-EN/js/modules/auth/authUI.js
// Giao diện người dùng cho xác thực trong ứng dụng Zero-EN

import { getElement } from "../core/domHelpers.js";

export const setAuthMessage = (message) => {
  const authMessageElement = getElement("authMessage");
  if (authMessageElement) authMessageElement.textContent = message;
};

export const setGreeting = (userIdentifier) => {
  const greetingElement = getElement("userName");

  let shortName = "User";

  if (typeof userIdentifier === "string") {
    // Nếu là email -> cắt phần trước @
    shortName = userIdentifier.includes("@")
      ? userIdentifier.split("@")[0]
      : userIdentifier;
  } else if (userIdentifier?.email) {
    // Nếu là object user -> lấy email
    shortName = userIdentifier.email.split("@")[0];
  }

  if (greetingElement) {
    greetingElement.textContent = `Hi, ${shortName}!`;
    console.log(`[authUI] Đã đặt tên người dùng: Hi, ${shortName}!`);
  } else {
    console.warn("[authUI] Không tìm thấy phần tử 'userName' để hiển thị lời chào.");
  }
};
