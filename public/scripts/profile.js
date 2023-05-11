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
  // .then((response) => response.json())
  // .then((myJson) => {
  //   console.log("JSON:", myJson);
  // });
});
