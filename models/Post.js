const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema({
  postNumber: Number,
  username: String,
  profileScore: Number,
  //   userImage: "?",
  timePosted: Date,
  postText: String,
  //   postImage: "?",
  postScore: Number,
  amountPostVoted: Number,
  postReview: String,
  tags: [String],
});

const Post = model("Post", postSchema);

let newPostID = 1;
let date = Date().substring(4, 21);

function addNewPost(username, post) {
  let newPost = {
    postNumber: newPostID,
    username: username,
    timePosted: date,
    postText: post.postText,
    postReview: "hard coded review",
  };
  Post.create(newPost).catch((error) => {
    console.log("Error: ", error);
  });
  newPostID++;
}

async function getPosts(n = 5) {
  let data = [];
  await Post.find({})
    .sort({ timePosted: -1 })
    .limit(n)
    .exec()
    .then((mongoData) => {
      data = mongoData;
    })
    .catch((err) => {
      console.log("Error:" + err);
    });
  return data;
}

module.exports = { addNewPost, getPosts };
