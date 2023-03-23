/* 

Currently I think my app will have two main areas to store data on:

- post[] will store the individual data about a singular post, including the user information and associated post scores

- profile[] will store data about the user who is signed into the application, including their personal score and profile information

As the application develops I imagine more data will need to be stored depending on the direction and development of the concept.
For now I believe this covers the main data I need to store.

*/

let post = [
  {
    username: "John",
    profileScore: 3, // personal profile score
    userImage: "", // profile picture
    timePosted: Date.now(),
    postText: "This is my first post",
    postImage: "", // optional if user wants to add media
    postScore: 2, // average score on post
    amountPostVoted: 84, // amount of people who voted on the post
    postReview: "This post sucks!",
  },
];

let profile = [
  {
    username: "John",
    userImage: "",
    bio: "Welcome to my profile",
    profileScore: 3,
    amountProfileVoted: 31, // amount of people who voted on the profile
    recentPosts: [], // users previous posts
  },
];
