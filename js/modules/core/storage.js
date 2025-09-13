// js/modules/core/storage.js
// Quản lý lưu trữ localStorage

const LS_KEYS = {
  user: "vt_user",
  starred: "vt_starred",
  settings: "vt_settings",
  progress: "vt_progress",
  pending: "vt_starred_pending"
};

export const Storage = {
  loadUser() {
    try { return JSON.parse(localStorage.getItem(LS_KEYS.user)) || null; }
    catch { return null; }
  },
  saveUser(user) {
    localStorage.setItem(LS_KEYS.user, JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem(LS_KEYS.user);
  },

  loadStarred() {
    try {
      const arr = JSON.parse(localStorage.getItem(LS_KEYS.starred)) || [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  },
  saveStarred(set) {
    localStorage.setItem(LS_KEYS.starred, JSON.stringify([...set]));
    localStorage.setItem(LS_KEYS.pending, "true");
  },

  markSynced() {
    localStorage.removeItem(LS_KEYS.pending);
  },
  isPendingSync() {
    return localStorage.getItem(LS_KEYS.pending) === "true";
  },

  loadSettings() {
    try { return JSON.parse(localStorage.getItem(LS_KEYS.settings)) || {}; }
    catch { return {}; }
  },
  saveSettings(obj) {
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(obj));
  },

  loadProgress(page) {
    try {
      const prog = JSON.parse(localStorage.getItem(LS_KEYS.progress)) || {};
      return prog[page] || { index: 0, visitedCount: 0 };
    } catch {
      return { index: 0, visitedCount: 0 };
    }
  },
  saveProgress(page, { index, visitedCount }) {
    const prog = JSON.parse(localStorage.getItem(LS_KEYS.progress)) || {};
    prog[page] = { index, visitedCount };
    localStorage.setItem(LS_KEYS.progress, JSON.stringify(prog));
  }
};
