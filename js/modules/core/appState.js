// js/modules/core/appState.js
// Quản lý trạng thái ứng dụng chung

export const appState = {
  user: null,                // { email }
  page: "index",             // trang hiện tại (file index.html)
  words: [],                 // danh sách vocab đang dùng
  index: 0,                  // con trỏ từ hiện tại
  visitedCount: 0,           // số từ đã xem (để tính progress)
  starred: new Set(),        // tập từ được gắn sao (key = word)
  shuffleSeen: new Set(),    // dùng cho shuffleToggle

  // Toggle states
  shuffleActive: false,
  searchActive: false,
  darkMode: false,

  // Timer state (gom chung cho clock + flashcard)
  timerActive: null,
  timerSec: null,
  timerTotal: null,
  timers: {
    countdownInterval: null
  },

  settings: {
    clockSeconds: 5,       // mặc định 5s
    flashcardSeconds: 5    // mặc định 5s
  }
};

// Helper: lấy tên hiển thị từ user (chỉ phần trước @ của email)
export function getDisplayName(user) {
  if (!user?.email) return "";
  return user.email.split("@")[0];
}
