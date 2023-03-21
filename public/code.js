function getUsers() {
  fetch("/data")
    .then((response) => response.json())
    .then((fetchedData) => console.log(fetchedData));
}

function newUser(name = "User 1", age = 23) {
  let userData = { name: name, age: age };
  console.log(JSON.stringify(userData));
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };
  fetch("/newUser", options)
    .then((response) => response.json())
    .then((serverResponse) => console.log(serverResponse));
}

let posts = [];

function newPost(user, message) {
  let post = {
    username: user,
    userScore: 4,
    timePosted: Date.now(),
    postText: message,
    postScore: 2,
    postReview: "This is a review",
  };
  posts.unshift(post);
}
