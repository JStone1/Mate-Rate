// code for handling updating bio
let userBio = document.getElementById("user-bio");
let newBioText = document.getElementById("bio-text");
console.log(newBioText);
let bioBtn = document.getElementById("update-bio-btn");

newBioText.addEventListener("click", () => {
  document.getElementsByClassName("update-success")[0].classList.add("hidden");
});

bioBtn.addEventListener("click", async () => {
  document
    .getElementsByClassName("update-success")[0]
    .classList.remove("hidden");
  let userInfo = {
    bio: newBioText.value,
  };
  newBioText.value = "";
  fetch("/updateBio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
});

// code for handling updating password
let passwordBtn = document.getElementById("update-password-btn");
let newPassword = document.getElementById("new-password-text");
console.log(newPassword);

newPassword.addEventListener("click", () => {
  document.getElementsByClassName("update-success")[1].classList.add("hidden");
});

passwordBtn.addEventListener("click", async () => {
  document
    .getElementsByClassName("update-success")[1]
    .classList.remove("hidden");
  let userInfo = {
    password: newPassword.value,
  };
  newPassword.value = "";
  fetch("/updatePassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
});
