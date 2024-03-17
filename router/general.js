const express = require('express');
let books = require("./booksdb.js");
const jwt = require("jsonwebtoken");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Middleware to decode JWT token and extract username
const authenticateUser = (req, res, next) => {
  let token = req.headers.authorization;
  token = token.split(" ")[1];
  console.log(token)
  if (token) {
    try {
      const decoded = jwt.verify(token, "your-secret-key");
      req.username = decoded.username;
      next();
    } catch(err) {
      console.error(err);
    }
  } else {
    return res.status(403).json({ message: "Token not provided" });
  }
};


public_users.post("/register", (req,res) => {
  users.push(req.body);
  return res.status(300).json({message: "registered"});
});
const authenticatedUser = (username,password)=>{
  for(let i in users){
    if(users[i].username === username && users[i].password === password){
      return true;
    }
  }
  return false;
}

public_users.put("/auth/review/:isbn", authenticateUser,(req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if(books[isbn]){
    const username = req.username;
    books[isbn].reviews[username] = review;
    return res.status (200).json({message: "Review added"});
  }
  return res.status(403).json({message: "Invalid ISBN"});
});
public_users.post("/login", (req,res) => {
  console.log("Login")
  console.log(req.body)
  const {username, password} = req.body;
  if(authenticatedUser(req.body.username,req.body.password)) {
    const token = jwt.sign({username}, "your-secret-key", {expiresIn: "1h"});
    return res.status(200).json({ message: "Login successful", token });
  }
  return res.status(403).json({message: "Invalid credentials"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  return res.status(300).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  for(let i in books){
    if(i === req.params.isbn){
      return res.status(300).json({message: books[i]});
    }
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  for(let i in books){
    if(books[i].author === req.params.author){
      return res.status(300).json({message: books[i]});
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  for(let i in books){
    if(books[i].title === req.params.title){
      return res.status(300).json({message: books[i]});
    }
  }
});

public_users.get('/review/:isbn',function (req, res) {
    for(let i in books){
        if(i === req.params.isbn){
        return res.status(300).json({message: books[i].reviews});
        }
    }
  return res.status(403).json({message: "Invalid ISBN"});
});
// delete a book review from a user
public_users.delete("/auth/review/:isbn", authenticateUser, (req, res) => {
  const isbn = req.params.isbn;
  if(books[isbn]){
    const username = req.username;
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted"});
  }
  return res.status(403).json({message: "Invalid ISBN"});
});
module.exports.general = public_users;