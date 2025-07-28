// js/modules/dataService.js

import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { app } from "./firebaseConfig.js";
import { getCurrentUser } from "./authService.js";

const db = getFirestore(app);

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

export const starWord = async (wordData) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated.");
    const docRef = doc(db, `users/${user.uid}/starredWords`, wordData.word);
    await setDoc(docRef, wordData);
};

export const unstarWord = async (word) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated.");
    const docRef = doc(db, `users/${user.uid}/starredWords`, word);
    await deleteDoc(docRef);
};

export const getStarredWords = async () => {
    const user = getCurrentUser();
    if (!user) return new Set();
    const querySnapshot = await getDocs(collection(db, `users/${user.uid}/starredWords`));
    return new Set(querySnapshot.docs.map(doc => doc.data().word));
};

export const saveUserDataToFirestore = async (userId, state) => {
    if (!userId) return;
    const docRef = doc(db, `users/${userId}/appState/bookStates`);
    await setDoc(docRef, state);
};

export const loadUserDataFromFirestore = async (userId) => {
    if (!userId) return null;
    const docRef = doc(db, `users/${userId}/appState/bookStates`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};