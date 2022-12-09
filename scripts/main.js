let usernameValidations = true;
let emailValidations = true;
let matchPassword = true;
let loading = false;
let seePassword = false;

const form = document.getElementById("signupForm");
const usernameErr = document.querySelector(".usernameErr");
const emailErr = document.querySelector(".emailErr");
const passwordErr = document.querySelector(".passwordErr");
const matchErr = document.querySelector(".matchErr");
const loadingEl = document.querySelector(".loading");
const seePasswordEl = document.querySelector(".seePassword");
const password = document.getElementById("password");
const password_confirmation = document.getElementById("password_confirmation");
const username = document.getElementById("username");
const email = document.getElementById("email");
const formBtnText = document.querySelector("#signupForm button[type='submit'] .text");
const eye = document.querySelector(".eye");

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
const passwordError = (messages) => {
   passwordErr.classList.remove("hidden");
   password.classList.add("border-red-500");
   password_confirmation.classList.add("border-red-500");
   passwordErr.innerHTML += `<span class="block">${messages}</span>`;
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
const stopLoading = () => {
   loadingEl.classList.add("hidden");
   formBtnText.classList.remove("hidden");
};
const passwordErrorMassages = (errors) => {
   errors.forEach((error) => {
      passwordError(error);
   });
   password.classList.add("border-red-500");
   password_confirmation.classList.add("border-red-500");
   stopLoading();
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
      stopLoading();
   }

   // validate username
   let usernameRegex = /^\D[a-z|0-9]{3,15}\D$/gi;
   usernameValidations = usernameRegex.test(data.username);

   // validate email
   let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/g;
   emailValidations = emailRegex.test(data.email);

   // validate password
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
         stopLoading();
         break;
      case emailValidations:
         emailError();
         stopLoading();
         break;
      case matchPassword:
         matchError();
         stopLoading();
         break;
      default:
         break;
   }

   if (
      usernameValidations &&
      emailValidations &&
      data.password === data.password_confirmation
   ) {
      fetch("https://goldblv.com/api/hiring/tasks/register", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            accept: "application/json",
         },
         body: JSON.stringify(data),
      })
         .then((response) => response.json())
         .then((data) => {
            console.log("Success:", data);

            // password error from backend
            if (data.errors?.password) {
               passwordErrorMassages(data.errors.password);
            } else {
               localStorage.setItem("email", data.email);
               window.location.href = "/flow-ui-vanila/loggedin.html";
            }
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
