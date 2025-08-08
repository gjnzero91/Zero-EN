// Zero-EN/js/modules/ui/progressUI.js
// Thiết lập giao diện người dùng cho thanh tiến trình trong ứng dụng Zero-EN

export const updateProgressBar = (progressBar, state) => {
  if (!progressBar || !state.words || state.words.length === 0) return;
  const progress = (state.currentIndex / (state.words.length - 1)) * 100 || 0;
  progressBar.style.width = `${progress}%`;
};

export const updateStarIcon = (starIcon, word, starredWords) => {
  if (starIcon) {
    if (starredWords.has(word)) {
      starIcon.classList.add("active");
    } else {
      starIcon.classList.remove("active");
    }
  }
};