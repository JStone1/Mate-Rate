const express = require("express");
const app = express();
app.listen(3000, () => console.log("Listening at port 3000"));

app.use(express.static("public"));
app.use(express.json());

const path = require("path");

let userData = [
  { name: "John", age: 23 },
  { name: "Anna", age: 24 },
];

app.get("/data", (request, response) => {
  response.json({
    time: Date.now(),
    data: userData,
  });
});

app.post("/newUser", (request, response) => {
  console.log("Request.body = ", request.body);
  let newUser = request.body;
  userData.push(newUser);
  response.json({
    status: "successful",
    numberOfUsers: userData.length,
  });
});
