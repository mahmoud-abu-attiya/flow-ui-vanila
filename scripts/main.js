let usernameValidations = true;
let emailValidations = true;
let passwordValidations = true;
let matchPassword = true;
let loading = false;
let seePassword = false;

let form = document.getElementById("signupForm");
let usernameErr = document.querySelector(".usernameErr");
let emailErr = document.querySelector(".emailErr");
let passwordErr = document.querySelector(".passwordErr");
let matchErr = document.querySelector(".matchErr");
let loadingEl = document.querySelector(".loading");
let seePasswordEl = document.querySelector(".seePassword");
let password = document.getElementById("password");
let password_confirmation = document.getElementById("password_confirmation");
let username = document.getElementById("username");
let email = document.getElementById("email");
let formBtnText = document.querySelector("#signupForm button[type='submit'] .text");
let eye = document.querySelector(".eye");

const seePasswordToggle = () => {
   let password = document.getElementById("password");
   let password_confirmation = document.getElementById("password_confirmation");
   if (seePassword) {
      password.type = "password";
      password_confirmation.type = "password";
      eye.classList.add("fa-eye-slash");
      eye.classList.remove("fa-eye");
      seePassword = false;
   } else {
      password.type = "text";
      password_confirmation.type = "text";
      eye.classList.add("fa-eye");
      eye.classList.remove("fa-eye-slash");
      seePassword = true;
   }
};
const usernameError = () => {
   usernameErr.classList.remove("hidden");
   username.classList.add("border-red-500");
};
const emailError = () => {
   emailErr.classList.remove("hidden");
   email.classList.add("border-red-500");
};
const passwordError = () => {
   passwordErr.classList.remove("hidden");
   password.classList.add("border-red-500");
   password_confirmation.classList.add("border-red-500");
};
const matchError = () => {
   matchErr.classList.remove("hidden");
   password_confirmation.classList.add("border-red-500");
   password.classList.add("border-red-500");
};
const setLoading = () => {
   loadingEl.classList.remove("hidden");
   formBtnText.classList.add("hidden");
};
const removeLoading = () => {
   loadingEl.classList.add("hidden");
   formBtnText.classList.remove("hidden");
};

form.onsubmit = (e) => {
   let formData = new FormData(form);
   const data = Object.fromEntries(formData);
   e.preventDefault();
   loading = true;

   // set loading
   if (loading) {
      setLoading();
   } else {
      removeLoading();
   }

   // validate username
   let usernameRegex = /^\D[a-z|0-9]{3,15}\D$/gi;
   usernameValidations = usernameRegex.test(data.username);

   // validate email
   let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/g;
   emailValidations = emailRegex.test(data.email);

   // validate password
   let passwordRegex =
      /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
   passwordValidations = passwordRegex.test(data.password);
   if (data.password !== data.password_confirmation) {
      matchPassword = false;
      loading = false;
   } else {
      matchPassword = true;
   }

   // set error messages
   switch (false) {
      case usernameValidations:
         usernameError();
         removeLoading();
         break;
      case emailValidations:
         emailError();
         removeLoading();
         break;
      case passwordValidations:
         passwordError();
         removeLoading();
         break;
      case matchPassword:
         matchError();
         removeLoading();
         break;
      default:
         break;
   }

   if (
      usernameValidations &&
      emailValidations &&
      passwordValidations &&
      data.password === data.password_confirmation
   ) {
      fetch("https://goldblv.com/api/hiring/tasks/register", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      })
         .then((response) => response.json())
         .then((data) => {
            console.log("Success:", data);
            localStorage.setItem("email", data.email);
            window.location.href = "/loggedin.html";
         })
         .catch((error) => {
            console.error("Error:", error);
            loading = false;
         });
   } else {
      loading = false;
   }
};

username.oninput = () => {
   usernameErr.classList.add("hidden");
   username.classList.remove("border-red-500");
};

email.oninput = () => {
   emailErr.classList.add("hidden");
   email.classList.remove("border-red-500");
};

password.oninput = () => {
   passwordErr.classList.add("hidden");
   password.classList.remove("border-red-500");
};

password_confirmation.oninput = () => {
   matchErr.classList.add("hidden");
   password_confirmation.classList.remove("border-red-500");
};

seePasswordEl.onclick = () => {
   seePasswordToggle();
};