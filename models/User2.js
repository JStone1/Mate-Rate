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

async function addNewUser(username, password) {
  const user = { username: username, password: password, loggedin: false };
  await User.create(user).catch((error) => {
    console.log("ERROR: ", error);
  });
}

async function getUsers() {
  let userData = [];
  await User.find({})
    .exec()
    .then((mongoData) => {
      userData = mongoData;
      console.log(userData);
    })
    .catch((error) => {
      console.log("ERROR: ", error);
    });
  return userData;
}

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

async function setLoggedIn(username, loginState) {
  let user = findUser(username);
  if (user) {
    user.isLoggedIn = loginState;
  }
}

async function checkLoggedIn(username) {
  let user = findUser(username);
  if (user) {
    return (user.isLoggedIn = loginState);
  }
  return false;
}

module.exports = {
  addNewUser,
  getUsers,
  findUser,
  checkPassword,
  setLoggedIn,
  checkLoggedIn,
};
