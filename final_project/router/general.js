const express = require("express");
const general = express.Router();
const axios = require("axios");

// Task 10 - Get the List of Books Available in the Shop using Axios and async-await
general.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://your-api-url/books");
    const allBooks = response.data;
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve books" });
  }
});

// Task 11 - Get Book Details Based on ISBN using Axios and async-await
general.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://your-api-url/books/isbn/${isbn}`);
    const book = response.data;
    res.json(book);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 12 - Get Book Details Based on Author using Axios and async-await
general.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(
      `http://your-api-url/books/author/${author}`
    );
    const booksByAuthor = response.data;
    res.json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ message: "No books by this author found" });
  }
});

// Task 13 - Get Books Based on Title using Axios and async-await
general.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(
      `http://your-api-url/books/title/${title}`
    );
    const booksWithTitle = response.data;
    res.json(booksWithTitle);
  } catch (error) {
    res.status(404).json({ message: "No books with this title found" });
  }
});

module.exports.general = general;
