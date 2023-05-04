// create express server
const express = require("express");
const app = express();
app.listen(3000, () => console.log("Listening at port 3000"));

app.set("view engine", "ejs");

app.use(express.static("public")); // allows express to serve static files - these are stored in the "public" folder

app.use(express.json()); // method in express that recognises the incoming request Object as a JSON Object

app.use(express.urlencoded({ extended: false })); // method in express that recognises the incoming request Object as strings or arrays

const path = require("path");

require("dotenv").config();
const mongoPassword = process.env.MYMONGOPASSWORD;

const sessions = require("express-session"); // access to express sessions

const oneHour = 1000 * 60 * 60; // variable for an hour

app.use(
  sessions({
    secret: "My secret key",
    saveUninitialized: true,
    cookie: { maxAge: oneHour },
    resave: false,
  })
);

// access to cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const postData = require("./models/Post.js"); // access to post model

const userData = require("./models/User.js"); // access to user model

const mongoose = require("mongoose"); // access to mongoose

mongoose.connect(
  // connect to MongoDB instance
  `mongodb+srv://JStone1:${mongoPassword}@cluster0.jxho5pt.mongodb.net/MyApp`
);

app.get("/", (request, response) => {
  response.render("pages/login");
});

app.get("/register", (request, response) => {
  response.render("pages/register");
});

app.get("/login", (request, response) => {
  response.render("pages/login");
});

// controller for user login
app.post("/login", async (request, response) => {
  let user = request.body;
  console.log("userData: ", user.username, user.password);
  // checks if user exists, then checks if password matches
  if (userData.findUser(user.username)) {
    if (await userData.checkPassword(user.username, user.password)) {
      request.session.username = user.username;
      userData.setLoggedIn(user.username, true);
      response.render("pages/app");
    } else {
      response.render("pages/login");
    }
  } else {
    console.log("User not found");
  }
});

// controller for logging out
app.post("/logout", (request, response) => {
  userData.setLoggedIn(request.session.username, false);
  request.session.destroy();
  console.log("Logged out");
  response.render("pages/login");
});

// controller for user registration
app.post("/register", async (request, response) => {
  console.log(request.body);
  let userData = request.body;
  if (await userData.findUser(userData.username)) {
    response.json({
      status: "failed",
      error: "User already exists",
    });
  } else {
    userData.addNewUser(userData.username, userData.password);
    console.log("New user added");
    response.render("pages/login");
  }
});

//test that user is logged in with a valid session
function checkLoggedIn(request, response, nextAction) {
  if (request.session) {
    // checks if session exists
    if (request.session.username) {
      nextAction();
    } else {
      request.session.destroy();
      return response.render("pages/login");
    }
  }
}

//controller for the main app view, depends on user logged in state
app.get("/app", checkLoggedIn, async (request, response) => {
  // uses checkLoggedIn function as validation before redirecting user to app
  response.render("pages/app");
});

//controller for the posts page view, depends on user logged in state
app.get("/posts", checkLoggedIn, async (request, response) => {
  let posts = await postData.getPosts();
  console.log("Current posts: ", posts);
  posts.forEach((post) => {
    post.createdAt.toString();
  });
  response.render("pages/posts", { data: { posts: posts } });
});

// controller for adding a new post
app.post("/newPost", (request, response) => {
  console.log("Data sent from model:", request.body);
  postData.addNewPost(request.session.username, request.body);
});

// controller for receiving previous posts
app.get("/getPosts", async (request, response) => {
  response.json({
    posts: await postData.getPosts(),
  });
});

app.post("/updateScore", async (request, response) => {
  let posts = await postData.getPosts();
  // converts js object to string then, access specific position in string, then convert it back to an int
  console.log("Request.body: ", request.body);
  let score = JSON.stringify(request.body);
  score = score.charAt(score.length - 3);
  score = parseInt(score);
  console.log("Score: ", score);
  let post = request.body.postNum; // postNum is a hidden input field in app.ejs form
  console.log("Post: ", post);
  postData.ratePost(post, score);
  response.status(204); // http code for "No content" - stops page from waiting for response
  response.send(console.log("Score updated"));
});

app.get("/profile", checkLoggedIn, async (request, response) => {
  console.log("Current user: ", request.session.username);
  let user = await userData.findUser(request.session.username);
  console.log("HERE:", user);
  let userPosts = await postData.findUserPosts(user.username);
  response.render("pages/profile", { data: { user: user, posts: userPosts } });
});
