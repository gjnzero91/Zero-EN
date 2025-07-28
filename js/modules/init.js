// js/modules/init.js
// Khởi tạo logic cho các trang

import { loginUser, registerUser, loginWithGoogle, signOutUser, observeAuthState, getCurrentUser } from "./authService.js";
import { fetchWordsFromCsv, starWord, getStarredWords, unstarWord, saveUserDataToFirestore, loadUserDataFromFirestore } from "./dataService.js";
import { getElement, setAuthMessage, redirectTo, setGreeting, updateWordDisplay, updateProgressBar, updateStarIcon, setupSearchDialog, setupCountdownDialog, speak } from "./ui.js";

// Trạng thái ứng dụng
let appState = {
    'a1-b1': { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 0 },
    'b2-c2': { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 0 },
    'star': { words: [], currentIndex: 0, shuffleMode: false, shuffledIndices: [], countdownTime: 0 }
};

const getBookState = (key) => appState[key];
const setBookStateProperty = (key, prop, value) => appState[key][prop] = value;

const loadLocalState = () => {
    const localState = localStorage.getItem("appState");
    if (localState) {
        appState = JSON.parse(localState);
    }
};

const saveLocalState = () => {
    localStorage.setItem("appState", JSON.stringify(appState));
};

const initializeBookData = async (bookKey) => {
    let words = [];
    if (bookKey === 'a1-b1') {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=0&single=true&output=csv";
        words = await fetchWordsFromCsv(url);
    } else if (bookKey === 'b2-c2') {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_ZxHDx2YJ9jtrkTyhEzSWdw7Z7V9wdtGugkXiKQqsD6qB8RERy5lJpxoobN4EXTFbCVwyrnhbuMnO/pub?gid=2053150601&single=true&output=csv";
        words = await fetchWordsFromCsv(url);
    } else if (bookKey === 'star') {
        const starredWordsSet = await getStarredWords();
        words = [...starredWordsSet]; // Chuyển Set thành Array
    }
    setBookStateProperty(bookKey, 'words', words);
    return words;
};

const loadBook = async (bookKey) => {
    const bookState = getBookState(bookKey);
    const words = bookState.words;

    if (words.length === 0) {
        updateWordDisplay(null);
        updateProgressBar(getElement("progressBar"), bookState);
        return;
    }

    const currentIndex = bookState.shuffleMode ? bookState.shuffledIndices[bookState.currentIndex] : bookState.currentIndex;
    const wordObj = words[currentIndex];

    updateWordDisplay(wordObj);
    
    // Tự động đọc từ vựng khi từ mới xuất hiện
    if (wordObj && wordObj.word) {
        speak(wordObj.word);
    }
    
    const starredWords = await getStarredWords();
    updateStarIcon(getElement("starIcon"), wordObj.word, starredWords);
    updateProgressBar(getElement("progressBar"), bookState);

    saveLocalState();
    const user = getCurrentUser();
    if (user) {
        saveUserDataToFirestore(user.uid, appState);
    }
};

const handleSearch = (bookKey) => {
    const query = getElement("searchInput").value.trim();
    if (query === "") return;
    const bookState = getBookState(bookKey);
    const wordsToSearch = bookState.words;
    const foundIndex = wordsToSearch.findIndex(wordObj => wordObj.word.toLowerCase() === query.toLowerCase());

    if (foundIndex !== -1) {
        setBookStateProperty(bookKey, 'currentIndex', foundIndex);
        loadBook(bookKey);
        getElement("searchDialog").classList.add("hidden");
        getElement("searchInput").value = '';
    } else {
        alert("Word not found. Please try again.");
    }
};

// Hàm chính để khởi tạo trang từ vựng
const setupVocabPage = async (bookKey) => {
    setupHomeEventListeners();

    loadLocalState();
    const user = getCurrentUser();
    if (user) {
        const firestoreState = await loadUserDataFromFirestore(user.uid);
        if (firestoreState) {
            appState = { ...appState, ...firestoreState };
        }
    }

    const state = getBookState(bookKey);
    if (!state.words || state.words.length === 0) {
        await initializeBookData(bookKey);
    }
    
    // Set up event listeners
    const pronounceBtn = getElement("pronounce");
    const wordDisplay = getElement("wordDisplay");
    const nextBtn = getElement("next");
    const prevBtn = getElement("prev");
    const starIcon = getElement("starIcon");
    const shuffleToggle = getElement("shuffleToggle");

    if (pronounceBtn) pronounceBtn.onclick = () => {
        const bookState = getBookState(bookKey);
        const wordObj = bookState.words[bookState.currentIndex];
        speak(wordObj.word);
    };

    if (wordDisplay) wordDisplay.onclick = () => {
        const bookState = getBookState(bookKey);
        const word = bookState.words[bookState.currentIndex].word;
        window.open(`https://dictionary.cambridge.org/dictionary/english/${word}`, '_blank');
    };

    if (nextBtn) nextBtn.onclick = () => {
        const bookState = getBookState(bookKey);
        const newIndex = (bookState.currentIndex + 1) % bookState.words.length;
        setBookStateProperty(bookKey, 'currentIndex', newIndex);
        loadBook(bookKey);
    };
    
    if (prevBtn) prevBtn.onclick = () => {
        const bookState = getBookState(bookKey);
        const newIndex = (bookState.currentIndex - 1 + bookState.words.length) % bookState.words.length;
        setBookStateProperty(bookKey, 'currentIndex', newIndex);
        loadBook(bookKey);
    };

    if (starIcon) starIcon.onclick = async () => {
        const bookState = getBookState(bookKey);
        const currentWordObj = bookState.words[bookState.currentIndex];
        if (!currentWordObj) return;

        const starredWords = await getStarredWords();
        const isStarred = starredWords.has(currentWordObj.word);

        if (isStarred) {
            await unstarWord(currentWordObj.word);
        } else {
            await starWord(currentWordObj);
        }

        // Tải lại sách từ vựng nếu đang ở trang sao để cập nhật
        if (bookKey === 'star') {
            await initializeBookData('star');
        }

        loadBook(bookKey);
    };

    if (shuffleToggle) shuffleToggle.onclick = () => {
        const bookState = getBookState(bookKey);
        const newShuffleMode = !bookState.shuffleMode;
        setBookStateProperty(bookKey, 'shuffleMode', newShuffleMode);
        shuffleToggle.classList.toggle('active', newShuffleMode);
        if (newShuffleMode) {
            const indices = Array.from({ length: bookState.words.length }, (_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            setBookStateProperty(bookKey, 'shuffledIndices', indices);
            setBookStateProperty(bookKey, 'currentIndex', 0);
        } else {
            setBookStateProperty(bookKey, 'shuffledIndices', []);
            setBookStateProperty(bookKey, 'currentIndex', 0);
        }
        loadBook(bookKey);
    };
    
    // Tải sách lần đầu
    loadBook(bookKey);
};

const setupLoginEventListeners = () => {
    // ...
};

const setupHomeEventListeners = () => {
    observeAuthState(user => {
        if (user) {
            setGreeting(user.email.split('@')[0]);
        } else {
            redirectTo("login.html");
        }
    });
    
    getElement("bookA1B1Btn")?.addEventListener("click", () => redirectTo("a1-b1.html"));
    getElement("bookB2C2Btn")?.addEventListener("click", () => redirectTo("b2-c2.html"));
    getElement("bookStarredBtn")?.addEventListener("click", () => redirectTo("star.html"));
    getElement("homeBtn")?.addEventListener("click", () => redirectTo("home.html"));
    getElement("logoutBtn")?.addEventListener("click", () => signOutUser().then(() => redirectTo("login.html")));
};

const setupIndexEventListeners = () => {
    getElement("getStartedBtn")?.addEventListener("click", () => redirectTo("login.html"));
};

const setupA1B1Page = () => setupVocabPage('a1-b1');
const setupB2C2Page = () => setupVocabPage('b2-c2');
const setupStarPage = () => setupVocabPage('star');

export const initPage = (pageName) => {
    switch (pageName) {
        case "index.html":
            setupIndexEventListeners();
            break;
        case "login.html":
            setupLoginEventListeners();
            break;
        case "home.html":
            setupHomeEventListeners();
            break;
        case "a1-b1.html":
            setupA1B1Page();
            break;
        case "b2-c2.html":
            setupB2C2Page();
            break;
        case "star.html":
            setupStarPage();
            break;
        default:
            console.log("No specific logic for this page.");
    }
};