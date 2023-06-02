// import { newPost } from "./posts.js";

let postText = document.getElementById("post-text");

export let currentText = "";

// checks post text
export function checkText(event) {
  currentText = event.target.value;
  console.log(currentText);
}

// checks if enter is pressed on input
export function checkEnter(event) {
  if (event.key === "Enter" || event.which === 13) {
    newPost();
    event.preventDefault();
  }
}

// clears input field
export function clearInput() {
  postText.value = "";
  currentText = "";
}

// code for responsive navbar
let smallNav = document.getElementById("small-nav");

window.addEventListener("resize", () => {
  if (window.innerWidth < 750) smallNav.classList.remove("hidden");
  else {
    smallNav.classList.add("hidden");
  }
});

window.addEventListener("load", () => {
  if (window.innerWidth < 750) smallNav.classList.remove("hidden");
  else {
    smallNav.classList.add("hidden");
  }
});
