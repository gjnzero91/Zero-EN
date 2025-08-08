// Zero-EN/js/modules/core/domHelpers.js
// Trợ giúp thao tác DOM trong ứng dụng Zero-EN

export const getElement = (id) => document.getElementById(id);

export const redirectTo = (page) => {
  window.location.href = page;
};