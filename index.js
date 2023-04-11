// create express server
const express = require("express");
const app = express();
app.listen(3000, () => console.log("Listening at port 3000"));

app.use(express.static("public"));
app.use(express.json());

const path = require("path");

const postList = []; // backend storage of posts
let nextPostID = 0;

require("dotenv").config();
const mongoPassword = process.env.MYMONGOPASSWORD;

const postData = require("./models/Post.js");

const users = require("./models/User.js");

const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://JStone1:${mongoPassword}@cluster0.jxho5pt.mongodb.net/MyApp`
);

// route for adding a new post
app.post("/newPost", (request, response) => {
  console.log("Data sent from model:", request.body);
  postData.addNewPost("John", request.body);
});

// route for receiving previous posts
app.get("/getPosts", async (request, response) => {
  response.json({
    posts: await postData.getPosts(15),
  });
});

app.post("/login", (request, response) => {
  console.log(users.getUsers());
  console.log("Login Successful");
});
