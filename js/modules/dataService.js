// js/modules/dataService.js
// Xử lý dữ liệu và trạng thái người dùng.

import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { app } from "./firebaseConfig.js";
import { getCurrentUser } from "./authService.js";

const db = getFirestore(app);


// ==== Lấy danh sách từ vựng từ file CSV ====
export const fetchWordsFromCsv = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    return parseCsv(csvText);
  } catch (error) {
    console.error("Failed to fetch or parse CSV:", error);
    return [];
  }
};

const parseCsv = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const words = [];
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(',').map(column => column.trim());
    if (columns.length >= 5) {
      words.push({
        word: columns[0],
        wordType: `${columns[1]}, ${columns[2]}`,
        ipa: columns[3]
      });
    }
  }
  return words;
};

// ==== Sử lý từ đươc đánh dấu Star ====

// Thêm từ vào danh sách yêu thích
export const starWord = async (wordObj) => {
  const user = getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const docRef = doc(db, "users", user.uid, "starredWords", wordObj.word);
  await setDoc(docRef, wordObj);
};

// Xóa từ khỏi danh sách yêu thích
export const unstarWord = async (word) => {
  const user = getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const docRef = doc(db, "users", user.uid, "starredWords", word);
  await deleteDoc(docRef);
};

// Lấy Set các từ đã đánh dấu (chỉ lấy key)
export const getStarredWords = async () => {
  const user = getCurrentUser();
  if (!user) return new Set();
  const colRef = collection(db, "users", user.uid, "starredWords");
  const snapshot = await getDocs(colRef);
  const words = new Set();
  snapshot.forEach(doc => {
    words.add(doc.id);
  });
  return words;
};

// Lấy toàn bộ object từ đã đánh dấu (dùng cho trang star)
export const getStarredWordsData = async () => {
  const user = getCurrentUser();
  if (!user) {
    console.warn("getStarredWordsData: User not authenticated, returning empty array.");
    return [];
  }
  console.log("getStarredWordsData: User UID:", user.uid);
  const colRef = collection(db, "users", user.uid, "starredWords");
  console.log("getStarredWordsData: Collection Path:", colRef.path);
  try {
    const snapshot = await getDocs(colRef);
    console.log("getStarredWordsData: Snapshot size:", snapshot.size);
    const words = [];
    snapshot.forEach(doc => {
      words.push(doc.data());
    });
    console.log("getStarredWordsData: Fetched words from Firestore:", words.length, words);
    return words;
  } catch (error) {
    console.error("getStarredWordsData: Error fetching documents:", error);
    return [];
  }
};

// Lưu trạng thái học của người dùng lên Firestore
export const saveUserDataToFirestore = async (uid, appState) => {
  if (!uid) throw new Error("User not authenticated.");
  const docRef = doc(db, `users/${uid}/userData/appState`);
  await setDoc(docRef, appState);
};