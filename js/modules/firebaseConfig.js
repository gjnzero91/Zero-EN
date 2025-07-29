// js/modules/firebaseConfig.js
// Cấu hình và khởi tạo ứng dụng Firebase.

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyBUIWBQZqTb9hWdeTjrtQHhzDlDhN6cCVs",
    authDomain: "zero-en.firebaseapp.com",
    projectId: "zero-en",
    storageBucket: "zero-en.firebasestorage.app",
    messagingSenderId: "756982049583",
    appId: "1:756982049583:web:70666424324e9d0b654fda",
    measurementId: "G-EWY95192B0"
};

export const app = initializeApp(firebaseConfig);