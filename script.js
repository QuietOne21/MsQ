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

// Utility function to show user-friendly messages
function showMessage(message, isError = false) {
    // You can replace this with a better UI notification system
    if (isError) {
        console.error(message);
    }
    alert(message);
}

// Utility function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to validate password strength
function isValidPassword(password) {
    return password.length >= 6; // Firebase minimum requirement
}

document.addEventListener("DOMContentLoaded", () => {
    // Handle Login Form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const emailInput = loginForm.querySelector("input[type='email']");
            const passwordInput = loginForm.querySelector("input[type='password']");
            
            if (!emailInput || !passwordInput) {
                showMessage("Form elements not found", true);
                return;
            }
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Basic validation
            if (!email || !password) {
                showMessage("Please fill in all fields", true);
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage("Please enter a valid email address", true);
                return;
            }
            
            try {
                await signInWithEmailAndPassword(auth, email, password);
                showMessage("Login successful!");
                window.location.href = "index3.html";
            } catch (error) {
                let errorMessage = "Login failed";
                
                // Provide user-friendly error messages
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = "No account found with this email";
                        break;
                    case 'auth/wrong-password':
                        errorMessage = "Incorrect password";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "Invalid email address";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Too many failed attempts. Please try again later";
                        break;
                    default:
                        errorMessage = error.message;
                }
                
                showMessage(errorMessage, true);
            }
        });
        
        // Handle "Register" link click
        const registerLink = loginForm.querySelector(".register a");
        if (registerLink) {
            registerLink.addEventListener("click", function(e) {
                e.preventDefault();
                window.location.href = "index2.html";
            });
        }
    }
    
    // Handle Sign-up Form
    const signUpForm = document.getElementById("signUpForm");
    if (signUpForm) {
        signUpForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const inputs = signUpForm.querySelectorAll("input");
            
            if (inputs.length < 6) {
                showMessage("Form is missing required fields", true);
                return;
            }
            
            const name = inputs[0].value.trim();
            const surname = inputs[1].value.trim();
            const email = inputs[2].value.trim();
            const phone = inputs[3].value.trim();
            const password = inputs[4].value;
            const confirmPassword = inputs[5].value;
            
            // Validation
            if (!name || !surname || !email || !phone || !password || !confirmPassword) {
                showMessage("Please fill in all fields", true);
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage("Please enter a valid email address", true);
                return;
            }
            
            if (!isValidPassword(password)) {
                showMessage("Password must be at least 6 characters long", true);
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage("Passwords do not match", true);
                return;
            }
            
            // Basic phone validation (you can make this more sophisticated)
            if (phone.length < 10) {
                showMessage("Please enter a valid phone number", true);
                return;
            }
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Save additional user data to database
                await set(ref(database, "users/" + user.uid), {
                    name: name,
                    surname: surname,
                    phone: phone,
                    email: email,
                    createdAt: new Date().toISOString()
                });
                
                showMessage("Account created successfully!");
                window.location.href = "index1.html";
                
            } catch (error) {
                let errorMessage = "Registration failed";
                
                // Provide user-friendly error messages
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = "An account with this email already exists";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "Invalid email address";
                        break;
                    case 'auth/weak-password':
                        errorMessage = "Password is too weak";
                        break;
                    default:
                        errorMessage = error.message;
                }
                
                showMessage(errorMessage, true);
            }
        });
        
        // Handle "Login" link click
        const loginLink = signUpForm.querySelector(".signIn a");
        if (loginLink) {
            loginLink.addEventListener("click", function(e) {
                e.preventDefault();
                window.location.href = "index1.html"; // Fixed: should go to login page
            });
        }
    }
});
