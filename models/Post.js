const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    postNumber: Number,
    username: String,
    profileScore: Number,
    imagePath: String,
    profilePic: String,
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

/* Taken and expanded from class example */
// adds new post to Post collection in database
async function addNewPost(username, post, imageFile, profilePic) {
  let newPostNumber = await Post.countDocuments({}); // gets the amount of documents in the Post collection
  console.log("Number of docs in Posts: ", newPostNumber);
  let newPost = {
    postNumber: newPostNumber,
    username: username,
    timePosted: Date().substring(4, 21),
    imagePath: imageFile,
    profilePic: profilePic,
    postText: post.post,
    postReview: "hard coded review",
    amountPostVoted: 0,
    archived: false,
  };
  Post.create(newPost).catch((error) => {
    console.log("Error: ", error);
  });
}

/* Taken from class example */
// retrieves all posts to display in feed
async function getPosts(n = 20) {
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

// retrieves a singular post
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

// adds who rated post to array and amount it was rated - avoids same person rating post twice
async function ratePost(postNum, rating, userId) {
  let post = await Post.find({ postNumber: postNum })
    .updateOne({ postScore: rating })
    .updateOne({ $inc: { amountPostVoted: 1 } })
    .updateOne({ $push: { whoVoted: userId } })
    .exec();
  console.log("Updated post: ", post);
  return post;
}

// retrieves posts specific to a user
async function findUserPosts(user) {
  let posts = await Post.find({ username: user, archived: false }).exec();
  return posts;
}

// "removes" post by toggling archive bool - this deletes post from view but keeps in database to preserve unique post numbers
async function removePost(postNum) {
  await Post.find({ postNumber: postNum }).updateOne({
    archived: true,
  });
}

// exports all functions from model
module.exports = {
  addNewPost,
  getPosts,
  getOnePost,
  ratePost,
  findUserPosts,
  removePost,
};
