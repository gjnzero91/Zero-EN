// Zero-EN/js/modules/data/dataService.js
// Quản lý dữ liệu từ Firestore và GitHub JSON

import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

import { db } from "../core/firebaseConfig.js";
import { getCurrentUser } from "../auth/authService.js";

/* ==== Lấy dữ liệu JSON từ GitHub Raw ==== */
export const fetchWordsFromJson = async (url) => {
  try {
    const response = await fetch(url);
    console.log("[JSON] Fetching:", url, "Status:", response.status);
    if (!response.ok) throw new Error("Lỗi HTTP: " + response.status);

    const data = await response.json();

    // Xử lý cả mảng và object chứa mảng
    let wordsArray = [];
    if (Array.isArray(data)) {
      wordsArray = data;
    } else if (data && Array.isArray(data.words)) {
      wordsArray = data.words;
    } else {
      console.warn("[JSON] Dữ liệu không phải mảng và không có field 'words'.");
    }

    console.log("[JSON] Tổng từ tải được:", wordsArray.length);
    return wordsArray;
  } catch (error) {
    console.error("[JSON] Lỗi khi tải:", error);
    return [];
  }
};

/* ==== Xử lý từ được đánh dấu Star ==== */
export const starWord = async (wordObj) => {
  const user = getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const docRef = doc(db, "users", user.uid, "starredWords", wordObj.word);
  await setDoc(docRef, wordObj);
};

export const unstarWord = async (word) => {
  const user = getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const docRef = doc(db, "users", user.uid, "starredWords", word);
  await deleteDoc(docRef);
};

export const getStarredWords = async () => {
  const user = getCurrentUser();
  if (!user) return new Set();
  const colRef = collection(db, "users", user.uid, "starredWords");
  const snapshot = await getDocs(colRef);
  const words = new Set();
  snapshot.forEach(doc => words.add(doc.id));
  return words;
};

export const getStarredWordsData = async () => {
  const user = getCurrentUser();
  if (!user) {
    console.warn("getStarredWordsData: User not authenticated, returning empty array.");
    return [];
  }
  const colRef = collection(db, "users", user.uid, "starredWords");
  try {
    const snapshot = await getDocs(colRef);
    const words = [];
    snapshot.forEach(doc => words.push(doc.data()));
    return words;
  } catch (error) {
    console.error("getStarredWordsData: Error fetching documents:", error);
    return [];
  }
};

/* ==== Dữ liệu appState của user ==== */
export const loadUserDataFromFirestore = async (uid) => {
  if (!uid) return null;
  const docRef = doc(db, `users/${uid}/userData/appState`);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? snapshot.data() : null;
};

export const saveUserDataToFirestore = async (uid, appState) => {
  if (!uid) throw new Error("User not authenticated.");
  const docRef = doc(db, `users/${uid}/userData/appState`);
  await setDoc(docRef, appState);
};

/* ==== Custom Packages ==== */
export const saveCustomPackagesToFirestore = async (packages) => {
  const user = getCurrentUser();
  if (!user) {
    console.warn("saveCustomPackagesToFirestore: Chưa đăng nhập.");
    return;
  }
  try {
    const ref = doc(db, `users/${user.uid}/customPackages/main`);
    await setDoc(ref, { data: packages });
    console.log("[Custom] Đã lưu custom packages cho user:", user.uid);
  } catch (err) {
    console.error("[Custom] Lỗi khi lưu custom packages:", err);
  }
};

export const loadCustomPackagesFromFirestore = async () => {
  const user = getCurrentUser();
  if (!user) {
    console.warn("loadCustomPackagesFromFirestore: Chưa đăng nhập.");
    return [];
  }
  try {
    const ref = doc(db, `users/${user.uid}/customPackages/main`);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      console.log("[Custom] Đã tải custom packages từ Firestore.");
      return snapshot.data().data || [];
    }
    return [];
  } catch (err) {
    console.error("[Custom] Lỗi khi tải custom packages:", err);
    return [];
  }
};
