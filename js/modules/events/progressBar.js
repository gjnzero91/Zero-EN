// js/modules/events/progressBar.js
// Xử lý thanh tiến trình hiển thị trạng thái học từ vựng

export function updateProgressBar(barId, visited, total) {
  const bar = document.getElementById(barId);
  if (!bar) return;

  const percent = total > 0 ? (visited / total) * 100 : 0;
  bar.style.width = percent + "%";
  bar.textContent = `${Math.round(percent)}%`;
}