// main.js

const currentPage = window.location.pathname.split("/").pop();

  // --- INDEX PAGE ---
  if (currentPage === "index.html") {
    const getStartedBtn = document.getElementById("getStartedBtn");
    if (getStartedBtn) {
      getStartedBtn.addEventListener("click", () => {
        window.location.href = "login.html";
      });
    }
  }

  // --- LOGIN PAGE ---
  else if (currentPage === "login.html") {
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        window.location.href = "home.html";
      });
    }
  }

  // --- HOME PAGE ---
  else if (currentPage === "home.html") {
    document.getElementById("bookA1B1Btn")?.addEventListener("click", () => {
      window.location.href = "a1-b1.html";
    });
    document.getElementById("bookB2C2Btn")?.addEventListener("click", () => {
      window.location.href = "b2-c2.html";
    });
    document.getElementById("bookStarredBtn")?.addEventListener("click", () => {
      window.location.href = "star.html";
    });
  }

  // --- COMMON NAVIGATION --- 
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }



// Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyDHAr8A7pV5VG8vlT-JyMu0sX6PoX9VAfY",
    authDomain: "vocab-5000-en-13cda.firebaseapp.com",
    projectId: "vocab-5000-en-13cda",
    storageBucket: "vocab-5000-en-13cda.firebasestorage.app",
    messagingSenderId: "354480151513",
    appId: "1:354480151513:web:3c52157c1b071f237417c8",
    measurementId: "G-S471NR63TR"
  };

  // Khởi tạo Firebase
  firebase.initializeApp(firebaseConfig);

  // Đăng ký người dùng mới
  const registerBtn = document.getElementById("registerBtn");
  registerBtn.addEventListener("click", () => {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        document.getElementById("authMessage").textContent = "Registered successfully!";
      })
      .catch(error => {
        document.getElementById("authMessage").textContent = error.message;
      });
  });

  // Đăng nhập người dùng đã đăng ký
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        document.getElementById("authMessage").textContent = "Logged in!";
      })
      .catch(error => {
        document.getElementById("authMessage").textContent = error.message;
      });
  });

  // Xác thực bằng Google
  const googleBtn = document.getElementById("googleLoginBtn");
  googleBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        document.getElementById("authMessage").textContent = `Logged in as ${result.user.email}`;
      })
      .catch(error => {
        document.getElementById("authMessage").textContent = error.message;
      });
  });
