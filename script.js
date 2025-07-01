//Handle Login Form
const loginForm = document.getElementById("loginForm");
 if (loginForm){
  loginForm.addEventListener("submit",function(e){
   e.preventDefault();
   window.location.href="index3.html";
  });

//Handle "Register" link click
const registerLink = loginForm.querySelector(".register a");
  registerLink.addEventListener("click",function(e){
   e.preventDefault();
   window.location.href = "index2.html";
  });
 }

//Handle sign-up form
const signUpForm = document.getElementById("signUpForm");
if(signUpForm){
 signUpForm.addEventListener("submit",function(e){
  e.preventDefault();
  window.location.href = "index1.html";
 });

 //Handle "Login" link click
 const loginLink = signUpForm.querySelector(".signIn a");
 loginLink.addEventListener("click",function(e){
  e.preventDefault();
  window.location.href = "index1.html";
 });
}









 

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
  const analytics = getAnalytics(app);



