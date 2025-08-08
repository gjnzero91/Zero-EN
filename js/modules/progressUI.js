// js/modules/progressUI.js
// Các hàm cập nhật tiến trình học và biểu tượng sao.

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