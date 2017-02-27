var showPassword = document.getElementById("showPassword"); 
var passwordInput = document.getElementById("passwordInput"); 

showPassword.addEventListener("click", function() {
  showPassword.checked ? passwordInput.type = 'text' : passwordInput.type = 'password';
});
