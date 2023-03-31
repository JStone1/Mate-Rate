import { newPost } from "./posts.js";

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
