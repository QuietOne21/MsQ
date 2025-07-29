import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD0V9jyO2m6ZjXmJxDrKaOyCTonvtpKfKU",
    authDomain: "reneq-25db.firebaseapp.com",
    projectId: "reneq-25db",
    storageBucket: "reneq-25db.firebasestorage.app",
    messagingSenderId: "87519655030",
    appId: "1:87519655030:web:b6874d99338c4c199f1b57",
    measurementId: "G-CSRJ8Y1F2X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Password validation function
function validatePassword(password) {
    if (password.length <= 6) {
        return "Password must be greater than 6 characters";
    }
    
    if (!/\d/.test(password)) {
        return "Password must include at least one number";
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return "Password must include at least one special character";
    }
    
    if (!/[a-zA-Z]/.test(password)) {
        return "Password must include at least one letter";
    }
    
    return null; // Password is valid
}

document.addEventListener("DOMContentLoaded", () => {
    // Handle Login Form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const email = loginForm.querySelector("input[type='email']").value.trim();
            const password = loginForm.querySelector("input[type='password']").value;
            
            try {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login successful");
                window.location.href = "index3.html";
            } catch (error) {
                alert("Login failed: " + error.message);
            }
        });
    }
    
    // Handle Sign-up Form
    const signUpForm = document.getElementById("signUpForm");
    if (signUpForm) {
        signUpForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const inputs = signUpForm.querySelectorAll("input");
            const name = inputs[0].value.trim();
            const surname = inputs[1].value.trim();
            const email = inputs[2].value.trim();
            const phone = inputs[3].value.trim();
            const password = inputs[4].value;
            const confirmPassword = inputs[5].value;
            
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }
            
            // Validate password strength
            const passwordError = validatePassword(password);
            if (passwordError) {
                alert(passwordError);
                return;
            }
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                await set(ref(database, "users/" + user.uid), {
                    name: name,
                    surname: surname,
                    phone: phone,
                    email: email
                });
                
                alert("Account created successfully!");
                window.location.href = "index1.html";
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }
});

// Simple global click handler for navigation links
document.addEventListener("click", function(e) {
    if (e.target.tagName === "A") {
        const linkText = e.target.textContent.toLowerCase();
        
        if (linkText.includes("register")) {
            e.preventDefault();
            window.location.href = "index2.html";
        } else if (linkText.includes("login")) {
            e.preventDefault();
            window.location.href = "index1.html";
        }
    }
});
