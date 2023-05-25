const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    postNumber: Number,
    username: String,
    profileScore: Number,
    imagePath: String,
    timePosted: Date,
    postText: String,
    postScore: Number,
    amountPostVoted: Number,
    whoVoted: [String],
    archived: Boolean,
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

let date = Date().substring(4, 21);

async function addNewPost(username, post, imageFile) {
  let newPostNumber = await Post.countDocuments({}); // gets the amount of documents in the Post collection
  console.log("Number of docs in Posts: ", newPostNumber);
  let newPost = {
    postNumber: newPostNumber,
    username: username,
    timePosted: Date().substring(4, 21),
    imagePath: imageFile,
    postText: post.post,
    postReview: "hard coded review",
    amountPostVoted: 0,
    archived: false,
  };
  Post.create(newPost).catch((error) => {
    console.log("Error: ", error);
  });
  // newPostNumber++;
}

async function getPosts(n = 5) {
  let data = [];
  await Post.find({ archived: false })
    .sort({ createdAt: -1 })
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

async function getOnePost(postNum) {
  let post;
  await Post.find({ postNumber: postNum })
    .exec()
    .then((mongoData) => {
      post = mongoData;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
  console.log("Retrieved Post: ", post);
  return post;
}

async function ratePost(postNum, rating, userId) {
  let post = await Post.find({ postNumber: postNum })
    .updateOne({ postScore: rating })
    .updateOne({ $inc: { amountPostVoted: 1 } })
    .updateOne({ $push: { whoVoted: userId } })
    .exec();
  console.log("Updated post: ", post);
  return post;
}

async function findUserPosts(user) {
  let posts = await Post.find({ username: user, archived: false }).exec();
  return posts;
}

async function removePost(postNum) {
  await Post.find({ postNumber: postNum }).updateOne({
    archived: true,
  });
}

module.exports = {
  addNewPost,
  getPosts,
  getOnePost,
  ratePost,
  findUserPosts,
  removePost,
};
