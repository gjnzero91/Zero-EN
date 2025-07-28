// main.js

const pathSegments = window.location.pathname.split("/");
const currentPage = pathSegments[pathSegments.length - 1] || "index.html";
  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyBUIWBQZqTb9hWdeTjrtQHhzDlDhN6cCVs",
    authDomain: "zero-en.firebaseapp.com",
    projectId: "zero-en",
    storageBucket: "zero-en.firebasestorage.app",
    messagingSenderId: "756982049583",
    appId: "1:756982049583:web:70666424324e9d0b654fda",
    measurementId: "G-EWY95192B0"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

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
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const googleLoginBtn = document.getElementById("googleLoginBtn");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");

    // Handle login
    const handleLogin = () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                document.getElementById("authMessage").textContent = "Logged in!";
                window.location.href = "home.html";
            })
            .catch(error => {
                document.getElementById("authMessage").textContent = error.message;
            });
    };

    // Handle register
    const handleRegister = () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                document.getElementById("authMessage").textContent = "Registered successfully!";
                window.location.href = "home.html";
            })
            .catch(error => {
                document.getElementById("authMessage").textContent = error.message;
            });
    };

    // Handle Google login
    const handleGoogleLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(result => {
                document.getElementById("authMessage").textContent = `Logged in as ${result.user.email}`;
                window.location.href = "home.html";
            })
            .catch(error => {
                document.getElementById("authMessage").textContent = error.message;
            });
    };

    // Handling click events for buttons
    if (loginBtn) {
        loginBtn.addEventListener("click", handleLogin);
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", handleRegister);
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", handleGoogleLogin);
    }

    // Handling the Enter key press event on input fields
    if (emailInput && passwordInput) {
        passwordInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleLogin();
            }
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
