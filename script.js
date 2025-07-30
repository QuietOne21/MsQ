            
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
                window.location.href = "index.html"; // Redirect after successful registration
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }
});

// Simple global click handler for navigation links
document.addEventListener("DOMContentLoaded", function() {
            const registerLink = document.getElementById('registerLink');
            const loginLink = document.getElementById('loginLink');
            
            if (registerLink) {
                registerLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log("Direct register event fired");
                    alert("Direct register event - would go to index2.html");
                    // window.location.href = "index2.html";
                });
            }
            
            if (loginLink) {
                loginLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log("Direct login event fired");
                    alert("Direct login event - would go to index1.html");
                    // window.location.href = "index1.html";
                });
            }
        });
});
