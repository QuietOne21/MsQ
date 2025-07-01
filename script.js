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

document.addEventListener("DOMContentLoaded",()=>{

//Handle Login Form
const loginForm = document.getElementById("loginForm");
 if (loginForm){
  loginForm.addEventListener("submit",function(e){
   e.preventDefault();

   const email = loginForm.querySelector("input[type='email']").value.trim();
   const password = loginForm.querySelector("input[type='password']").value;

   signInWithEmailAndPassword(auth,email,password)
     .then(() => {
       alert("Login successful");
       window.location.href = "index3.html";
     })
     .catch((error) => {
      alert("Login failed: "+ error.message);
     });
  });
  
//Handle "Register" link click
const registerLink = loginForm.querySelector(".register a");
  registerLink.addEventListener("click",function(e){
   e.preventDefault();
   window.location.href = "index2.html";
  });
 }
}

//Handle sign-up form
const signUpForm = document.getElementById("signUpForm");
if(signUpForm){
 signUpForm.addEventListener("submit",function(e){
  e.preventDefault();

  const inputs = signUpForm.querySelectorAll("input");
  const name = input[0].value;
  const surname = input[1].value;
  const email = inputs[2].value;
  const phone = inputs[3].value;
  const password = inputs[4].value;
  const confirmPassword = inputs[5].value;

  if(password!==confirmPassword){
   alert("password do not match");
   return;
  }


  createUserWithEmailAndPassword(auth, email, password)
   .then((userCredential)=>{
     const user = userCrendential.user;
     return set(ref(database, "users/"+user.uid), {
      name:name,
      surname:surname,
      phone:phone,
      email:email
     });
   })
   .then(()=>{
    alert("Account created");
    window.location.href = "index1.html";
   })
   .catch((error)=>{
     alert("Error: "+error.message);
   });
 });

 //Handle "Login" link click
 const loginLink = signUpForm.querySelector(".signIn a");
 loginLink.addEventListener("click",function(e){
  e.preventDefault();
  window.location.href = "index.html";
 });
}


