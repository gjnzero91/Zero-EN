// js/modules/ui.js
// Chức năng liên quan đến giao diện và DOM

export const getElement = (id) => document.getElementById(id);

export const setAuthMessage = (message) => {
    const authMessageElement = getElement("authMessage");
    if (authMessageElement) {
        authMessageElement.textContent = message;
    }
};

export const redirectTo = (page) => {
    window.location.href = page;
};

export const setGreeting = (name) => {
    const greetingElement = getElement("userGreeting");
    if (greetingElement) {
        greetingElement.textContent = `Hello, ${name}!`;
    }
};

export const updateWordDisplay = (wordObj) => {
    const wordDisplay = getElement("wordDisplay");
    const posDisplay = getElement("posDisplay");
    const ipaText = getElement("ipaText"); // Lấy phần tử span mới
    
    if (wordObj && wordDisplay && posDisplay && ipaText) {
        wordDisplay.classList.remove('show');

        setTimeout(() => {
            wordDisplay.textContent = wordObj.word;
            posDisplay.textContent = wordObj.wordType;
            ipaText.textContent = wordObj.ipa; // Chỉ cập nhật nội dung IPA
            
            wordDisplay.classList.add('show');
        }, 100);
        
    } else {
        wordDisplay.textContent = "No words found.";
        posDisplay.textContent = "";
        ipaText.textContent = "";
        wordDisplay.classList.add('show');
    }
};

export const speak = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
};

export const updateProgressBar = (progressBar, state) => {
    if (!progressBar || !state.words || state.words.length === 0) return;
    const progress = (state.currentIndex / (state.words.length - 1)) * 100 || 0;
    progressBar.style.width = `${progress}%`;
};

export const updateStarIcon = (starIcon, word, starredWords) => {
    if (starIcon) {
        starIcon.style.color = starredWords.has(word) ? "gold" : "white";
    }
};

export const setupSearchDialog = (searchIcon, searchDialog, searchInput, searchBtn, onSearch) => {
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

export const setupCountdownDialog = (clockToggle, countdownDialog, countdownInput, setCountdownBtn, cancelCountdownBtn, getCountdownTime, setCountdownTime) => {
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
