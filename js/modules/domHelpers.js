// js/modules/indexEvents.js
// Các hàm thao tác DOM cơ bản.

export const getElement = (id) => document.getElementById(id);

export const redirectTo = (page) => {
  window.location.href = page;
};