const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignupLink = document.getElementById("show-signup");
const showLoginLink = document.getElementById("show-login");
const errorMessage = document.getElementById("error-message");

showSignupLink.addEventListener("click", (event) => {
  event.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  errorMessage.textContent = "";
});

showLoginLink?.addEventListener("click", (event) => {
  event.preventDefault();
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  errorMessage.textContent = "";
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const signupEmail = document.getElementById("signup-email").value;
  const signupPassword = document.getElementById("signup-password").value;

  localStorage.setItem("userEmail", signupEmail);
  localStorage.setItem("userPassword", signupPassword);

  alert("Sign Up Successful! Please log in.");
  signupForm.style.display = "none";
  loginForm.style.display = "block";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const storedEmail = localStorage.getItem("userEmail");
  const storedPassword = localStorage.getItem("userPassword");

  if (email === storedEmail && password === storedPassword) {
    alert("Login Successful!");
    window.location.href = "expenses.html";
  } else {
    errorMessage.textContent = "Incorrect email or password. Please try again.";
  }
});
