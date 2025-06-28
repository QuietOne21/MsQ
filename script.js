 const form=document.getElementById("loginForm");
 form.addEventListener("register",function(e){
      e.preventDefault();
      window.location.href="index2.html";
  });

const form=document.getElementById("signUpForm");
form.addEventListener("signIn",function(e){
  e.preventDefault();
  window.location.href="index1.html";
});


<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD0V9jyO2m6ZjXmJxDrKaOyCTonvtpKfKU",
    authDomain: "reneq-25db.firebaseapp.com",
    projectId: "reneq-25db",
    storageBucket: "reneq-25db.firebasestorage.app",
    messagingSenderId: "87519655030",
    appId: "1:87519655030:web:b6874d99338c4c199f1b57",
    measurementId: "G-CSRJ8Y1F2X"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
