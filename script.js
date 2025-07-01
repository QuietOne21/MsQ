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



