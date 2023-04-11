const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema({
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

const Post = model("NewPost", postSchema);

function addNewPost(username, post) {
  let newPost = {
    username: username,
    timePosted: post.timePosted,
    postText: post.postText,
    postReview: "hard coded review",
  };
  Post.create(newPost).catch((error) => {
    console.log("Error: ", error);
  });
}

async function getPosts(n = 3) {
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
