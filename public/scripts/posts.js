import { clearInput, checkEnter, checkText, currentText } from "./utils.js";

let posts = []; // array to store posts
let postID = 1;
let postScore = 0;

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

let recentPosts = document.getElementById("recent-posts"); // handler for ul post list

let date = Date().substring(4, 21);

// function w/ temp data structure and adds a post to the post array
export function newPost() {
  if (currentText.length == 0) {
    console.log("Please enter text to post");
  } else {
    let newPost = {
      username: "User 1",
      timePosted: date,
      postText: currentText,
    };
    postWords(newPost);
    clearInput();
  }
}

// function that handles data posting to the backend
function postWords(post) {
  console.log(post);

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  };
  fetch("/newPost", options)
    .then((response) => response.json())
    .then((serverData) => handleServerData(serverData));
  console.log("Posted");
}

// creates list item for new post to display on screen
function displayPostData() {
  // recentPosts.innerHTML = "";
  posts.forEach((post) => {
    let li = document.createElement("li");
    li.classList.add("post");
    let liName = document.createElement("h3");
    let liText = document.createElement("p");
    liText.classList.add("post-text");
    let liTime = document.createElement("p");

    // code to create user stars
    let starContainer = document.createElement("div");
    starContainer.classList.add("star-container");
    let score = 0;
    for (let i = 0; i < 5; i++) {
      let star = document.createElement("span");
      star.classList.add("fa");
      star.classList.add("fa-star");
      star.classList.add(`star${i + 1}`);
      star.addEventListener("click", () => {
        console.log(star);
        score++;
        postScore = score;
        console.log(postScore);
      });
      starContainer.appendChild(star);
    }

    liTime.textContent = `Posted on ${post.timePosted}`;
    liName.textContent = `${post.username}`;
    liText.textContent = `${post.postText}`;
    starContainer.insertAdjacentHTML("beforeend", ":Post rating ");
    li.appendChild(liName);
    li.appendChild(liText);
    li.appendChild(liTime);
    li.appendChild(starContainer);
    recentPosts.appendChild(li);
  });
}

// fetches post data from the backend
function retrieveData() {
  fetch("/getPosts")
    .then((response) => response.json())
    .then((retrievedData) => handleServerData(retrievedData));
}

// takes new post data from the server and updates posts list
function handleServerData(data) {
  console.log(data);
  posts = data.posts;
  displayPostData();
}
