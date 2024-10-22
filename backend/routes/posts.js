const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");
const authenticateToken = require("../middleware/auth");
const path = require("path");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/create", auth, upload.single("image"), (req, res) => {
  const { text } = req.body;
  const author = req.user.id; // Get the logged-in user's ID from the auth middleware
  const db = req.db;

  const imageBuffer = req.file ? req.file.buffer : null; // Get the uploaded image buffer

  const query =
    "INSERT INTO posts (image, text, author, date) VALUES (?, ?, ?, NOW())";

  db.query(query, [imageBuffer, text, author], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error creating post back" });
    }
    res
      .status(201)
      .json({ message: "Post created successfully", postId: results.insertId });
  });
});

router.get("/", auth, (req, res) => {
  const db = req.db;
  const query = `
    SELECT posts.id, posts.text, posts.image, posts.date, users.username AS author
    FROM posts
    JOIN users ON posts.author = users.id
    ORDER BY posts.date DESC`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching posts" });
    }

    // Convert BLOB to Base64 string
    const posts = results.map((post) => {
      if (post.image) {
        post.image = Buffer.from(post.image).toString("base64");
      }
      return post;
    });

    res.json(posts);
  });
});

module.exports = router;
