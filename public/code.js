let posts = []; // array to store posts
let postID = 1;

// handler + event listener for input field
let postText = document.getElementById("post-text");
postText.addEventListener("input", checkText);
postText.addEventListener("keypress", checkEnter);
let currentText = "";

// handler + event listener for post button
let postButton = document.getElementById("post-button");
postButton.addEventListener("click", newPost);

// handler + event listener for retrieving post button
let getPosts = document.getElementById("get-posts");
getPosts.addEventListener("click", retrieveData);

let recentPosts = document.getElementById("recent-posts"); // handler for ul post list

// checks post text
function checkText(event) {
  currentText = event.target.value;
  console.log(currentText);
}

// checks if enter is pressed on input
function checkEnter(event) {
  if (event.key === "Enter" || event.which === 13) {
    newPost();
    event.preventDefault();
  }
}

// clears input field
function clearInput() {
  postText.value = "";
  currentText = "";
}

// function w/ temp data structure and adds a post to the post array
function newPost() {
  if (currentText.length == 0) {
    console.log("Please enter text to post");
  } else {
    let newPost = {
      postID: postID,
      username: "user1",
      userScore: 4,
      timePosted: Date.now(),
      postText: currentText,
      postScore: 2,
      postReview: "This is a review",
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
function getPostData() {
  recentPosts.innerHTML = "";
  posts.forEach((post) => {
    let li = document.createElement("li");
    let liText = document.createElement("p");
    liText.textContent = `Post ID: ${post.postID} - ${post.postText} posted by: ${post.username}`;
    li.appendChild(liText);
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
  getPostData();
}
