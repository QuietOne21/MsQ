            
            // Validate password strength
            const passwordError = validatePassword(password);
            if (passwordError) {
                alert(passwordError);
                return;
            }
            
            try {
                const userCredential = await createUser WithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                await set(ref(database, "users/" + user.uid), {
                    name: name,
                    surname: surname,
                    phone: phone,
                    email: email
                });
                
                alert("Account created successfully!");
                window.location.href = "index1.html"; // Redirect after successful registration
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
            window.location.href = "index2.html"; // Redirect to registration page
        } else if (linkText.includes("login")) {
            e.preventDefault();
            window.location.href = "index1.html"; // Redirect to login page
        }
    }
});
