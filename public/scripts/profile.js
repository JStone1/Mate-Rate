import { response } from "express";
import { clearInput, checkEnter, checkText, currentText } from "./utils.js";

let bioBtn = document.getElementById("update-bio-btn");
bioBtn.addEventListener("click", () => {
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  };
  fetch("/updateBio", options);
});
