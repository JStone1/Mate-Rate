const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

let date = Date().substring(4, 21);

async function addNewPost(username, post) {
  let newPostNumber = await Post.countDocuments({}); // gets the amount of documents in the Post collection
  console.log("Number of docs in Posts: ", newPostNumber);
  let newPost = {
    postNumber: newPostNumber,
    username: username,
    timePosted: Date().substring(4, 21),
    postText: post.postText,
    postReview: "hard coded review",
  };
  Post.create(newPost).catch((error) => {
    console.log("Error: ", error);
  });
  // newPostNumber++;
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

async function ratePost(postNum, rating) {
  let post = await Post.find({ postNumber: postNum })
    .updateOne({ postScore: rating })
    .exec();
  console.log("Updated post: ", post);
  return post;
}

module.exports = { addNewPost, getPosts, getOnePost, ratePost };
