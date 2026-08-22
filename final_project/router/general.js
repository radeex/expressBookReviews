const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Unable to register user. Username and password are required." });
    }

    if (isValid(username)) {
        return res.status(404).json({ message: "User already exists!" });
    }

    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4));
    }
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const isbns = Object.keys(books);
    const booksbyauthor = [];

    isbns.forEach((isbn) => {
        if (books[isbn].author === author) {
            booksbyauthor.push({
                "isbn": isbn,
                "title": books[isbn].title,
                "reviews": books[isbn].reviews
            });
        }
    });

    return res.status(200).send(JSON.stringify({ booksbyauthor }, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const isbns = Object.keys(books);
    const booksbytitle = [];

    isbns.forEach((isbn) => {
        if (books[isbn].title === title) {
            booksbytitle.push({
                "isbn": isbn,
                "author": books[isbn].author,
                "reviews": books[isbn].reviews
            });
        }
    });

    return res.status(200).send(JSON.stringify({ booksbytitle }, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    }
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
});

// Task 10: Get all books using async-await with Axios
const getAllBooksAsync = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log("Task 10 - All books:");
        console.log(JSON.stringify(response.data, null, 4));
        return response.data;
    } catch (error) {
        console.error("Error fetching all books:", error.message);
    }
};

// Task 11: Get book details by ISBN using Promise callbacks with Axios
const getBookByISBN = (isbn) => {
    return axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then((response) => {
            console.log(`Task 11 - Book details for ISBN ${isbn}:`);
            console.log(JSON.stringify(response.data, null, 4));
            return response.data;
        })
        .catch((error) => {
            console.error("Error fetching book by ISBN:", error.message);
        });
};

// Task 12: Get book details by author using async-await with Axios
const getBooksByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
        console.log(`Task 12 - Books by author ${author}:`);
        console.log(JSON.stringify(response.data, null, 4));
        return response.data;
    } catch (error) {
        console.error("Error fetching books by author:", error.message);
    }
};

// Task 13: Get book details by title using Promise callbacks with Axios
const getBooksByTitle = (title) => {
    return axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
        .then((response) => {
            console.log(`Task 13 - Books with title ${title}:`);
            console.log(JSON.stringify(response.data, null, 4));
            return response.data;
        })
        .catch((error) => {
            console.error("Error fetching books by title:", error.message);
        });
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitle = getBooksByTitle;
