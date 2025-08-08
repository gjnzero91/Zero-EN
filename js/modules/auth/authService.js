// Zero-EN/js/modules/auth/authService.js
// Dịch vụ xác thực người dùng trong ứng dụng Zero-EN

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { app } from "../core/firebaseConfig.js";

const auth = getAuth(app);

export function setAuthMessage(message) {
    const authMessage = document.getElementById("authMessage");
    if (authMessage) {
        authMessage.textContent = message;
    }
}
export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

export const signOutUser = () => {
    return signOut(auth);
};

export const observeAuthState = (callback) => {
    onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
    return auth.currentUser;
};