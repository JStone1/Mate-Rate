// create express server
const express = require("express");
const app = express();
app.listen(3000, () => console.log("Listening at port 3000"));

app.use(express.static("public"));
app.use(express.json());

const path = require("path");

const postList = []; // backend storage of posts
let nextPostID = 0;

// route for adding a new post
app.post("/newPost", (request, response) => {
  console.log(request.body);
  let post = request.body;
  post.postID = nextPostID++;
  postList.unshift(post);
  response.json({
    posts: postList.slice(0, 3),
  });
});

// route for receiving previous posts
app.get("/getPosts", (request, response) => {
  response.json({
    posts: postList.slice(0, 3),
  });
});
