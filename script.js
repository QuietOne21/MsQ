 document.addEventListener("DOMContentLoaded",function(){
    const form=document.querySelector("form");
    form.addEventListner("submit",function(e){
      e.preventDefault();
      window.location.href="index2.html";
    });
  });
