// js/modules/authUI.js
// Các hàm liên quan đến giao diện xác thực và chào người dùng.

import { getElement } from "./domHelpers.js";

export const setAuthMessage = (message) => {
  const authMessageElement = getElement("authMessage");
  if (authMessageElement) authMessageElement.textContent = message;
};

export const setGreeting = (name) => {
  const greetingElement = getElement("userGreeting");
  if (greetingElement) greetingElement.textContent = `Hi, ${name}!`;
};