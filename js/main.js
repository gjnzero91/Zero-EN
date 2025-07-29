  // Cho phép tắt clockTimer bằng click vào clockTimer
  if (clockTimer) {
    clockTimer.addEventListener("click", () => {
      if (countdownActive) stopCountdown();
    });
  }
// js/main.js

// Import các hàm cần thiết từ các module khác
import { getBookState, setBookStateProperty } from "./modules/state.js";
import { fetchWordsFromCsv } from "./modules/dataService.js";
import { initPage } from "./modules/pageInit.js";
import { setupVocabPage } from "./modules/vocabPage.js";
import { getElement } from "./modules/domHelpers.js";
import { setupSearchDialog } from "./modules/dialogUI.js";

// Định nghĩa các nguồn dữ liệu CSV cho từng loại từ vựng
const bookSources = {
  "a1-b1": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=0&single=true&output=csv",
  "b2-c2": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=2053150601&single=true&output=csv"
};

// Hàm đảm bảo tất cả dữ liệu từ vựng từ CSV đã được tải vào bộ nhớ đệm ứng dụng
async function ensureAllBookDataLoaded() {
  for (const key of Object.keys(bookSources)) {
    const state = getBookState(key);
    if (!state.words || state.words.length === 0) {
      const words = await fetchWordsFromCsv(bookSources[key]);
      setBookStateProperty(key, "words", words);
    }
  }
}

// Danh sách các trang từ vựng và key tương ứng
const bookPages = [
  { key: "a1-b1", page: "a1-b1.html" },
  { key: "b2-c2", page: "b2-c2.html" },
  { key: "star", page: "star.html" }
];

// Hàm tìm kiếm từ trong tất cả các danh mục từ vựng đã tải
function findWordInBooks(searchWord) {
  searchWord = searchWord.trim().toLowerCase();
  for (const { key, page } of bookPages) {
    const state = getBookState(key);
    if (!state || !state.words) continue;
    const idx = state.words.findIndex(w => w.word.toLowerCase() === searchWord);
    if (idx !== -1) {
      return { key, page, idx };
    }
  }
  return null;
}

// Lắng nghe sự kiện khi DOM đã tải xong
window.addEventListener("DOMContentLoaded", async () => {
  // Đảm bảo tất cả dữ liệu từ vựng từ CSV đã được tải trước khi tìm kiếm
  await ensureAllBookDataLoaded();

  // Lấy các phần tử DOM cần thiết cho chức năng tìm kiếm
  const searchIcon = getElement("searchIcon");
  const searchDialog = getElement("searchDialog");
  const searchInput = getElement("searchInput");
  const searchBtn = getElement("searchBtn");

  // Thiết lập hộp thoại tìm kiếm và xử lý sự kiện tìm kiếm khi người dùng nhập từ
  setupSearchDialog(
    searchIcon,
    searchDialog,
    searchInput,
    searchBtn,
    () => {
      const word = searchInput.value;
      if (!word) return;
      const found = findWordInBooks(word);
      if (found) {
        localStorage.setItem("searchTarget", JSON.stringify({ key: found.key, idx: found.idx }));
        window.location.href = found.page;
      } else {
        alert("Not found in any vocabulary list."); 
      }
      searchDialog.classList.add("hidden");
    }
  );

  // Countdown timer logic
  const clockToggle = getElement("clockToggle");
  const clockTimerContainer = getElement("clockTimerContainer");
  const clockTimer = getElement("clockTimer");
  const countdownDialog = getElement("countdownDialog");
  const countdownInput = getElement("countdownInput");
  const setCountdownBtn = getElement("setCountdownBtn");
  const cancelCountdownBtn = getElement("cancelCountdownBtn");
  const nextBtn = getElement("next");

  let countdownActive = false;
  let countdownValue = 10;
  let countdownInterval = null;
  let holdTimeout = null;

  function startCountdown() {
    let time = countdownValue;
    clockTimer.textContent = time;
    clockTimerContainer.style.display = "block";
    clockToggle.classList.add("active");
    countdownActive = true;
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      time--;
      clockTimer.textContent = time;
      if (time <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        // Tự động next sang từ tiếp theo
        if (nextBtn) nextBtn.click();
        // Nếu vẫn đang bật, tự động lặp lại
        if (countdownActive) startCountdown();
      }
    }, 1000);
  }

  function stopCountdown() {
    countdownActive = false;
    clockToggle.classList.remove("active");
    clockTimerContainer.style.display = "none";
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  // Toggle khi click
  if (clockToggle) {
    clockToggle.addEventListener("click", () => {
      if (countdownActive) {
        stopCountdown();
      } else {
        startCountdown();
      }
    });

    // Nhấn giữ để mở/đóng dialog cài đặt
    clockToggle.addEventListener("mousedown", () => {
      holdTimeout = setTimeout(() => {
        if (countdownDialog.classList.contains("hidden")) {
          countdownDialog.classList.remove("hidden");
          countdownInput.value = countdownValue;
        } else {
          countdownDialog.classList.add("hidden");
        }
      }, 500); // 500ms nhấn giữ
    });
    clockToggle.addEventListener("mouseup", () => {
      if (holdTimeout) clearTimeout(holdTimeout);
    });
    clockToggle.addEventListener("mouseleave", () => {
      if (holdTimeout) clearTimeout(holdTimeout);
    });
  }

  // Nút set thời gian
  if (setCountdownBtn) {
    setCountdownBtn.onclick = () => {
      const val = parseInt(countdownInput.value);
      if (!isNaN(val) && val > 0) {
        countdownValue = val;
        if (countdownActive) {
          startCountdown(); // reset lại timer
        }
        countdownDialog.classList.add("hidden");
      } else {
        alert("Please enter a valid time.");
      }
    };
  }
  if (cancelCountdownBtn) {
    cancelCountdownBtn.onclick = () => {
      countdownDialog.classList.add("hidden");
    };
  }
});

// Xác định trang hiện tại từ URL của trình duyệt
const pathSegments = window.location.pathname.split("/");
const currentPage = pathSegments[pathSegments.length - 1] || "index.html";

// Khởi tạo logic cụ thể cho trang hiện tại khi DOM đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  initPage(currentPage);
});

// Điều kiện đặc biệt để thiết lập trang từ vựng yêu thích nếu đang ở trang "star.html"
if (window.location.pathname.includes("star.html")) {
  setupVocabPage("star");
}