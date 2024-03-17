const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  for(let i in users){
    if(users[i].username === username && users[i].password === password){
      return true;
    }
  }
  return false;
}

//only registered users can login


// Add a book review


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
