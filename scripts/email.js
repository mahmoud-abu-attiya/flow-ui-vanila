let email = localStorage.getItem("email");
let emailEl = document.querySelector(".email");
if (!email) {
   window.location.href = "/flow-ui-vanila/signin.html";
}
emailEl.innerHTML = email;
emailEl.href = `mailto:${email}`;