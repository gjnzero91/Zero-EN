// js/modules/dialogUI.js
// Các hàm thiết lập dialog tìm kiếm và đếm ngược.

export const setupSearchDialog = (
  searchIcon,
  searchDialog,
  searchInput,
  searchBtn,
  onSearch
) => {
  if (searchIcon) {
    searchIcon.onclick = () => {
      if (searchDialog.classList.contains("hidden")) {
        searchDialog.classList.remove("hidden");
        searchIcon.classList.add("active");
      } else {
        searchDialog.classList.add("hidden");
        searchIcon.classList.remove("active");
      }
    };
  }
  if (searchBtn) {
    searchBtn.onclick = onSearch;
  }
  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") onSearch();
    });
  }
};

export const setupCountdownDialog = (
  clockToggle,
  countdownDialog,
  countdownInput,
  setCountdownBtn,
  cancelCountdownBtn,
  getCountdownTime,
  setCountdownTime
) => {
  if (clockToggle) {
    clockToggle.onclick = () => countdownDialog.classList.remove("hidden");
  }
  if (setCountdownBtn) {
    setCountdownBtn.onclick = () => {
      const newTime = parseInt(countdownInput.value);
      if (!isNaN(newTime) && newTime > 0) {
        setCountdownTime(newTime);
        countdownDialog.classList.add("hidden");
      } else {
        alert("Please enter a valid time.");
      }
    };
  }
  if (cancelCountdownBtn) {
    cancelCountdownBtn.onclick = () => countdownDialog.classList.add("hidden");
  }
};