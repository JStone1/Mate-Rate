import { clearInput, checkEnter, checkText, currentText } from "./utils.js";

// handler + event listener for input field
let postText = document.getElementById("post-text");
if (postText) {
  postText.addEventListener("input", checkText);
  postText.addEventListener("keypress", checkEnter);
}

// handler + event listener for post button
let postButton = document.getElementById("post-button");
if (postButton) {
  postButton.addEventListener("click", newPost);
}

// handler + event listener for retrieving post button
let getPosts = document.getElementById("get-posts");
if (getPosts) {
  getPosts.addEventListener("click", retrieveData);
}
