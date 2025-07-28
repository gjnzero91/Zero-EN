// js/modules/ui.js
// UI-related functions and DOM interactions

// ===== Basic DOM helpers =====

// Get element by ID
export const getElement = (id) => document.getElementById(id);

// Redirect to a different page
export const redirectTo = (page) => {
  window.location.href = page;
};

// ===== Authentication & User Info =====

// Show authentication message (e.g. login error)
export const setAuthMessage = (message) => {
  const authMessageElement = getElement("authMessage");
  if (authMessageElement) {
    authMessageElement.textContent = message;
  }
};

// Set greeting message for user
export const setGreeting = (name) => {
  const greetingElement = getElement("userGreeting");
  if (greetingElement) {
    greetingElement.textContent = `Hi, ${name}!`;
  }
};

// ===== Word Display =====

// Update the word display area (word, word type, IPA)
export const updateWordDisplay = (wordObj) => {
  const wordDisplay = getElement("wordDisplay");
  const posDisplay = getElement("posDisplay");
  const ipaText = getElement("ipaText");
  const pronounceBtn = getElement("pronounce");

  if (wordObj && wordDisplay && posDisplay && ipaText && pronounceBtn) {
    wordDisplay.classList.remove('show');

    setTimeout(() => {
      wordDisplay.textContent = wordObj.word;

      const wordTypes = wordObj.wordType
        .split(',')
        .map(type => type.trim())
        .filter(type => type !== '');

      posDisplay.textContent = wordTypes.join(', ');
      ipaText.textContent = wordObj.ipa;

      wordDisplay.classList.add('show');
    }, 100);
  } else {
    wordDisplay.textContent = "No words found.";
    posDisplay.textContent = "";
    ipaText.textContent = "";
    wordDisplay.classList.add('show');
  }
};

// Speak the given text using speech synthesis
export const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};

// ===== Learning Progress =====

// Update progress bar based on current learning state
export const updateProgressBar = (progressBar, state) => {
  if (!progressBar || !state.words || state.words.length === 0) return;

  const progress = (state.currentIndex / (state.words.length - 1)) * 100 || 0;
  progressBar.style.width = `${progress}%`;
};

// Update star icon color based on whether word is bookmarked
export const updateStarIcon = (starIcon, word, starredWords) => {
  if (starIcon) {
    starIcon.style.color = starredWords.has(word) ? "gold" : "white";
  }
};

// ===== Search Dialog =====

// Setup search dialog interactions
export const setupSearchDialog = (
  searchIcon,
  searchDialog,
  searchInput,
  searchBtn,
  onSearch
) => {
  if (searchIcon) {
    searchIcon.onclick = () => searchDialog.classList.remove("hidden");
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

// ===== Countdown Dialog =====

// Setup countdown timer dialog
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
