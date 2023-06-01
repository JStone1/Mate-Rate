const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  profilePicture: String,
  bio: String,
  postScores: Array,
  profileScore: Number,
  recentPosts: Array,
  isLoggedIn: Boolean,
});

const User = model("User", userSchema);

/* Taken and expanded from class example */
// creates and adds new user based on data typed in by user and predefined schema data
async function addNewUser(username, password) {
  const user = {
    username: username,
    password: password,
    loggedin: false,
    profilePicture: "uploads/8d05cd9d541ef737401d3ed36f96bd83",
    bio: "Welcome to my profile!",
    profileScore: 0,
    postScores: [0], // adds an initial score to the array to prevent crash (look at changing)
  };
  await User.create(user).catch((error) => {
    console.log("ERROR: ", error);
  });
}

/* Taken from class example */
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

/* Taken from class example */
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

/* Taken from class example */
// sets the user to be logged in after loggin in
async function setLoggedIn(username, loginState) {
  let user = findUser(username);
  if (user) {
    user.isLoggedIn = loginState;
  }
}

/* Taken from class example */
// checks the login state of user
async function checkLoggedIn(username) {
  let user = findUser(username);
  if (user) {
    return (user.isLoggedIn = loginState);
  }
  return false;
}

// updates user bio field
async function updateBio(user, bio) {
  User.find({ username: user }).updateOne({ bio: bio }).exec();
}

// adds post rating to an array that effects the user's profile score
async function updatePostScores(username, postScore) {
  await User.updateOne(
    { username: username },
    { $push: { postScores: postScore } }
  ).exec();
}

// calculates the average of user's post score and updates their profile score accordingly
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

// updates user password
async function updatePassword(username, password) {
  User.find({ username: username }).updateOne({ password: password }).exec();
}

// deletes user account from database
async function deleteUser(userID) {
  User.deleteOne({ _id: userID }).exec();
}

// changes profile pic based on image file sent through from server
async function updateProfilePic(username, imageFile) {
  User.find({ username: username })
    .updateOne({ profilePicture: imageFile })
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
  updatePassword,
  deleteUser,
  updateProfilePic,
};
