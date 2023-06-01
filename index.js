// create express server
const express = require("express");
const app = express();
app.listen(3000, () => console.log("Listening at port 3000"));

app.set("view engine", "ejs");

app.use(express.static("public")); // allows express to serve static files - these are stored in the "public" folder

app.use(express.json()); // method in express that recognises the incoming request Object as a JSON Object

app.use(express.urlencoded({ extended: false })); // method in express that recognises the incoming request Object as strings or arrays

const multer = require("multer"); // handles file uploads for multipart form data

const upload = multer({ dest: "./public/uploads" });

require("dotenv").config();
const mongoPassword = process.env.MYMONGOPASSWORD; // mongo password stored in a secret .env file

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
const { stringify } = require("querystring");
const { request } = require("http");

mongoose.connect(
  // connect to MongoDB instance
  `mongodb+srv://JStone1:${mongoPassword}@cluster0.jxho5pt.mongodb.net/MyApp`
);

// default controller for app
app.get("/", (request, response) => {
  response.render("pages/login");
});

// controller for register page
app.get("/register", (request, response) => {
  response.render("pages/register");
});

// controller for login page
app.get("/login", (request, response) => {
  response.render("pages/login");
});

/* Taken and expanded from class example */
// controller for user login
app.post("/login", async (request, response) => {
  let user = request.body;
  console.log("userData: ", user.username, user.password);
  // checks if user exists, then checks if password matches
  if (userData.findUser(user.username)) {
    if (await userData.checkPassword(user.username, user.password)) {
      let loggedInUser = await userData.findUser(user.username);
      request.session.userID = loggedInUser._id;
      request.session.username = user.username;
      userData.setLoggedIn(user.username, true);
      response.render("pages/info");
    } else {
      response.render("pages/login");
    }
  } else {
    console.log("User not found");
  }
});

/* Taken from class example */
// controller for logging out
app.post("/logout", (request, response) => {
  userData.setLoggedIn(request.session.username, false);
  request.session.destroy();
  console.log("Logged out");
  response.render("pages/logged-out");
});

// controller for user registration
app.post("/register", async (request, response) => {
  console.log(request.body);
  let user = request.body;
  if (await userData.findUser(user.username)) {
    // if user enters username that is already in database
    response.json({
      status: "failed",
      error: "User already exists",
    });
  } else {
    // ads user to database if doesn't already exist
    userData.addNewUser(user.username, user.password);
    console.log("New user added");
    response.render("pages/login");
  }
});

/* Taken from class example */
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
app.get("/new-post", checkLoggedIn, async (request, response) => {
  // uses checkLoggedIn function as validation before redirecting user to app
  let user = await userData.findUser(request.session.username);
  response.render("pages/new-post", { data: { user: user } });
});

//controller for the posts page view, depends on user logged in state
app.get("/view-posts", checkLoggedIn, async (request, response) => {
  let posts = await postData.getPosts();
  let user = await userData.findUser(request.session.username);
  console.log("Current user: ", user);
  console.log("Current posts: ", posts);
  posts.forEach((post) => {
    post.createdAt.toString();
  });
  console.log(request.session);
  response.render("pages/view-posts", {
    data: {
      // gives access to data from backend in the ejs page
      posts: posts,
      user: user,
      userID: request.session.userID,
      username: request.session.username,
    },
  });
});

// controller for info page
app.get("/info", async (request, response) => {
  response.render("pages/info");
});

/* Taken and expanded from class example */
// controller for adding a new post
app.post("/newPost", upload.single("myImage"), async (request, response) => {
  console.log(request.file);
  let fileName;
  let posts = await postData.getPosts();
  if (request.file && request.file.filename) {
    fileName = "uploads/" + request.file.filename;
  }
  console.log("FILENAME: ", fileName);
  let user = await userData.findUser(request.session.username);
  await postData.addNewPost(
    // sends data for post image and profile picture to access from view post
    request.session.username,
    request.body,
    fileName,
    user.profilePicture
  );
  console.log("body: ", request.body);
  console.log("Posts: ", posts);
  response.render("pages/post-success");
});

// controller for receiving previous posts
app.get("/getPosts", async (request, response) => {
  response.json({
    posts: await postData.getPosts(),
  });
});

// controller for when a user rates a post - retrieves value of rating and sends it to User model to add to the rating array that effects their profile score
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
  let postAuthor = request.body.postAuthor;
  console.log("Author: ", postAuthor);
  let user = await userData.findUser(postAuthor);
  console.log("user.username:", user.postScores);
  postData.ratePost(post, score, request.session.userID);
  await userData.updatePostScores(user.username, score);
  await userData.updateProfileScore(postAuthor, user.postScores);
  response.status(204); // http code for "No content" - stops page from waiting for response
  response.send(console.log("Score updated"));
});

// controller for profile button, user must be logged in
app.get("/profile", checkLoggedIn, async (request, response) => {
  console.log("Current user: ", request.session.username);
  let user = await userData.findUser(request.session.username);
  let userPosts = await postData.findUserPosts(user.username);
  response.render("pages/profile", { data: { user: user, posts: userPosts } });
});

// controller for settings button, user must be logged in
app.get("/settings", checkLoggedIn, async (request, response) => {
  console.log("Current user: ", request.session.username);
  let user = await userData.findUser(request.session.username);
  let userPosts = await postData.findUserPosts(user.username);
  response.render("pages/settings", { data: { user: user, posts: userPosts } });
});

// controller for updating profile picture, sends filename to user model to update the picture in their posts
app.post(
  "/updateProfilePic",
  upload.single("myImage"),
  async (request, response) => {
    console.log(request.file);
    let filename;
    if (request.file && request.file.filename) {
      filename = "uploads/" + request.file.filename;
    }
    userData.updateProfilePic(request.session.username, filename);
  }
);

// Add in feedback on frontend after update
app.post("/updateBio", (request, response) => {
  console.log("Got to the backend", request.body.bio);
  userData.updateBio(request.session.username, request.body.bio);
  response.redirect(request.get("referer")); // redirects to current page
});

// Add in feedback on frontend after update
app.post("/updatePassword", (request, response) => {
  console.log("Got to the backend", request.body.password);
  userData.updatePassword(request.session.username, request.body.password);
});

// controller for deleting user from database
app.post("/deleteUser", async (request, response) => {
  console.log(request.body.username);
  response.render("pages/account-deleted");
  await userData.deleteUser(request.session.userID);
});

// controller for archiving user post
app.post("/removePost", async (request, response) => {
  let post = request.body.postNum; // postNum is a hidden input field in app.ejs form
  postData.removePost(post);
  response.redirect(request.get("referer")); // redirects to current page
});
