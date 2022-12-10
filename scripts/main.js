let usernameValidations = true,
   emailValidations = true,
   matchPassword = true,
   loading = false,
   seePassword = false;

const form = document.getElementById("signupForm"),
   usernameErr = document.querySelector(".usernameErr"),
   emailErr = document.querySelector(".emailErr"),
   passwordErr = document.querySelector(".passwordErr"),
   matchErr = document.querySelector(".matchErr"),
   loadingEl = document.querySelector(".loading"),
   seePasswordEl = document.querySelector(".seePassword"),
   password = document.getElementById("password"),
   password_confirmation = document.getElementById("password_confirmation"),
   username = document.getElementById("username"),
   email = document.getElementById("email"),
   formBtnText = document.querySelector("#signupForm button[type='submit'] .text"),
   eye = document.querySelector(".eye"),
   errors = document.querySelectorAll(".error");

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
const usernameError = (massage) => {
   usernameErr.classList.remove("hidden");
   username.classList.add("border-red-500");
   usernameErr.innerHTML += `<span class="block">${massage}</span>`;
};
const emailError = (massage) => {
   emailErr.classList.remove("hidden");
   email.classList.add("border-red-500");
   emailErr.innerHTML += `<span class="block">${massage}</span>`;
};
const passwordError = (messages) => {
   passwordErr.classList.remove("hidden");
   password.classList.add("border-red-500");
   password_confirmation.classList.add("border-red-500");
   passwordErr.innerHTML += `<span class="block">${messages}</span>`;
};
const matchError = (messages) => {
   matchErr.classList.remove("hidden");
   password_confirmation.classList.add("border-red-500");
   password.classList.add("border-red-500");
   matchErr.innerHTML += `<span class="block">${messages}</span>`;
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
const emailErrorMassages = (errors) => {
   errors.forEach((error) => {
      emailError(error);
   });
   email.classList.add("border-red-500");
   stopLoading();
};
const usernameErrorMassages = (errors) => {
   errors.forEach((error) => {
      usernameError(error);
   });
   username.classList.add("border-red-500");
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

   // clear error messages
   errors.forEach((error) => {
      error.classList.add("hidden");
   });
   form.querySelectorAll("input").forEach((input) => {
      input.classList.remove("border-red-500");
   });

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
         usernameError([
            "Username must be between 5 and 15 characters and can only contain letters and numbers and can not start or end with numbers.",
         ]);
         stopLoading();
         break;
      case emailValidations:
         emailError("Please enter a valid email address.");
         stopLoading();
         break;
      case matchPassword:
         matchError("Password and password confirmation must match.");
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
            Accept: "application/json",
         },
         body: JSON.stringify(data),
      })
         .then((response) => response.json())
         .then((data) => {
            console.log("Success:", data);

            // handle backend errors
            if (data.errors?.password) {
               passwordErrorMassages(data.errors.password);
            } else if (data.errors?.email) {
               emailErrorMassages(data.errors.email);
            } else if (data.errors?.username) {
               usernameErrorMassages(data.errors.username);
            } else {
               localStorage.setItem("email", data.email);
               window.location.href = "./loggedin.html";
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

form.querySelectorAll("input").forEach((input) => {
   input.oninput = () => {
      input.classList.remove("border-red-500");
      input
         .closest(".form-control")
         .querySelector(".error")
         .classList.add("hidden");
   };
});

seePasswordEl.onclick = () => {
   seePasswordToggle();
};
