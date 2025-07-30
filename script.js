            
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
document.addEventListener("click", function(e) {
            console.log("Click detected on:", e.target);
            console.log("Tag name:", e.target.tagName);
            console.log("Text content:", e.target.textContent);
            
            // Add visual feedback
            document.getElementById('output').innerHTML += `<p>Clicked: ${e.target.tagName} - "${e.target.textContent}"</p>`;
            
            if (e.target.tagName.toLowerCase() === "a") {
                const linkText = e.target.textContent.toLowerCase().trim();
                console.log("Link text:", linkText);
                
                if (linkText.includes("register")) {
                    e.preventDefault();
                    console.log("Register link clicked - would redirect to index2.html");
                    alert("Register link clicked! Would redirect to index2.html");
                    // window.location.href = "index2.html";
                } else if (linkText.includes("login")) {
                    e.preventDefault();
                    console.log("Login link clicked - would redirect to index1.html");
                    alert("Login link clicked! Would redirect to index1.html");
                    // window.location.href = "index1.html";
                }
            }
        });
