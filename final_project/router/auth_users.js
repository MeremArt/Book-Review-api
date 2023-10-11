const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
let books = require("./booksdb.js");

const app = express();
app.use(bodyParser.json());

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Implement your validation logic for username (e.g., length, special characters)
  return true; // Replace with your validation logic
};

const authenticatedUser = (username, password) => {
  // Check if the username and password match the ones in your records
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return !!user; // Return true if authenticated, false otherwise
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if 'username' and 'password' are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    // Generate a JWT token and send it in the response
    const token = jwt.sign({ username }, "your-secret-key", {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .json({ message: "User successfully logged in", token });
  } else {
    return res
      .status(401)
      .json({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review (requires authentication)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if a valid JWT token is present in the request header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "your-secret-key");

    // Check if the user is authenticated
    if (authenticatedUser(decoded.username, decoded.password)) {
      // Implement logic to add the review to the book with the given ISBN
      const book = books.find((b) => b.isbn === isbn);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Check if the user has already reviewed the book and update the review
      const existingReview = book.reviews.find(
        (r) => r.username === decoded.username
      );
      if (existingReview) {
        existingReview.review = review;
        return res.status(200).json({ message: "Review updated successfully" });
      } else {
        // If the user hasn't reviewed the book, add a new review
        book.reviews.push({ username: decoded.username, review });
        return res.status(200).json({ message: "Review added successfully" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(403).json({ message: "Token is not valid" });
  }
});

// Delete a book review (requires authentication)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Check if a valid JWT token is present in the request header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "your-secret-key");

    // Check if the user is authenticated
    if (authenticatedUser(decoded.username, decoded.password)) {
      // Find the book with the given ISBN
      const book = books.find((b) => b.isbn === isbn);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Filter and delete the reviews based on the session username
      book.reviews = book.reviews.filter(
        (review) => review.username !== decoded.username
      );

      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(403).json({ message: "Token is not valid" });
  }
});

app.use("/regd_users", regd_users);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
