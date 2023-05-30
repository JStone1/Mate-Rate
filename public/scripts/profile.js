// import { clearInput, checkEnter, checkText, currentText } from "./utils.js";

// let bioBtn = document.getElementById("update-bio-btn");

// bioBtn.addEventListener("click", async () => {
//   let options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: "This is my body",
//   };
//   await fetch("/updateBio", options)
//     .then((response) => {
//       return response.json();
//     })
//     .then((myJson) => {
//       console.log("myJson:", myJson);
//     });
// });

let userBio = document.getElementById("user-bio");
let newBioText = document.getElementById("bio-text");
console.log(newBioText);
let bioBtn = document.getElementById("update-bio-btn");

bioBtn.addEventListener("click", async () => {
  let userInfo = {
    bio: newBioText.value,
  };
  fetch("/updateBio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
});

let passwordBtn = document.getElementById("update-password-btn");
let newPassword = document.getElementById("new-password-text");
console.log(newPassword);

passwordBtn.addEventListener("click", async () => {
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

// Add in delete profile below //

// let deleteProfileBtn = document.getElementById("delete-profile-btn");
// let confirmDeleteText = document.getElementById("confirm-delete-tex");
// console.log(newPassword);

// deleteProfileBtn.addEventListener("click", async () => {
//   let userInfo = {
//     password: newPassword.value,
//   };
//   newPassword.value = "";
//   fetch("/updatePassword", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userInfo),
//   });
// });
