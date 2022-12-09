let email = localStorage.getItem("email");
let emailEl = document.querySelector(".email");
if (!email) {
   window.location.href = "./signin.html";
}
emailEl.innerHTML = email;
emailEl.href = `mailto:${email}`;