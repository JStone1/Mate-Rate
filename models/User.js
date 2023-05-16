const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  // userImage: "",
  bio: String,
  postScores: Array,
  profileScore: Number,
  amountProfileVoted: Number,
  recentPosts: Array,
  isLoggedIn: Boolean,
});

const User = model("User", userSchema);

// creates new user based on data typed in by user
async function addNewUser(username, password) {
  const user = {
    username: username,
    password: password,
    loggedin: false,
    bio: "Welcome to my profile!",
    profileScore: 0,
    postScores: [0], // adds an initial score to the array to prevent crash (look at changing)
  };
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

async function updateBio(user, bio) {
  User.find({ username: user }).updateOne({ bio: bio }).exec();
}

async function updatePostScores(username, postScore) {
  await User.updateOne(
    { username: username },
    { $push: { postScores: postScore } }
  ).exec();

  // console.log(User.find({ postScores }));
}

async function updateProfileScore(username, score) {
  console.log("HERE:", score);
  total = 0;
  for (let i = 0; i < score.length; i++) {
    total += score[i];
  }
  let newScore = total / score.length;
  console.log("New score:", newScore);

  await User.find({ username: username })
    .updateOne({ profileScore: newScore })
    .exec();
}

// exports all functions from model
module.exports = {
  addNewUser,
  getUsers,
  findUser,
  checkPassword,
  setLoggedIn,
  checkLoggedIn,
  updateBio,
  updatePostScores,
  updateProfileScore,
};
