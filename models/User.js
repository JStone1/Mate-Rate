const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  // userImage: "",
  bio: String,
  profileScore: Number,
  amountProfileVoted: Number,
  recentPosts: Array,
  isLoggedIn: Boolean,
});

const User = model("User", userSchema);

// creates new user based on data typed in by user
async function addNewUser(username, password) {
  const user = { username: username, password: password, loggedin: false };
  await User.create(user).catch((error) => {
    console.log("ERROR: ", error);
  });
}

// returns all users from database
async function getUsers() {
  let userData = [];
  await User.find({})
    .exec() // executes the search
    .then((mongoData) => {
      userData = mongoData;
      console.log(userData);
    })
    .catch((error) => {
      console.log("ERROR: ", error);
    });
  return userData;
}

// finds specific user from database
async function findUser(username) {
  let user = "";
  await User.findOne({ username: username })
    .exec()
    .then((mongoData) => {
      user = mongoData;
    })
    .catch((error) => {
      console.log("ERROR: ", error);
    });
  return user;
}

// checks if the password the user types into login field matches the password stored in database
async function checkPassword(username, password) {
  let user = await findUser(username);
  console.log("User:", user);
  if (user) {
    if (password == user.password) {
      console.log("User and password are correct");
      return true;
    } else {
      console.log("User and password DON'T match.");
      return false;
    }
  }
  console.log("User doesn't exist in database.");
  return false;
}

// sets the user to be logged in after loggin in
async function setLoggedIn(username, loginState) {
  let user = findUser(username);
  if (user) {
    user.isLoggedIn = loginState;
  }
}

// checks the login state of user
async function checkLoggedIn(username) {
  let user = findUser(username);
  if (user) {
    return (user.isLoggedIn = loginState);
  }
  return false;
}

// exports all functions from model
module.exports = {
  addNewUser,
  getUsers,
  findUser,
  checkPassword,
  setLoggedIn,
  checkLoggedIn,
};
