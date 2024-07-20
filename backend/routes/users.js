const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");
const authenticateToken = require("../middleware/auth");
const path = require("path");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Setting up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to get profile picture

router.get("/profile-picture", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT profilePic FROM users WHERE id = ?";
  const db = req.db;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error retrieving profile picture:", err);
      return res.status(500).send("Error retrieving profile picture");
    }
    if (result.length > 0 && result[0].profilePic) {
      res.set("Content-Type", "image/jpeg"); // Set appropriate content type
      res.send(result[0].profilePic); // Send the binary data as the response
    } else {
      res.status(404).send("Profile picture not found");
    }
  });
});

// Route to upload profile picture

router.post(
  "/profile-picture",
  authenticateToken,
  upload.single("profilePic"),
  (req, res) => {
    const userId = req.user.id;
    const profilePic = req.file.buffer;
    const db = req.db;

    console.log("Received file:", req.file);

    const sql = "UPDATE users SET profilePic = ? WHERE id = ?";
    db.query(sql, [profilePic, userId], (err, result) => {
      if (err) {
        console.error("Error updating profile picture:", err);
        return res.status(500).send("Error updating profile picture");
      }
      res.send("Profile picture updated successfully");
    });
  }
);

// Register user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const db = req.db;

  try {
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (results.length > 0) {
          return res.status(400).json({ msg: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.query(
          "INSERT INTO users SET ?",
          { username, email, password: hashedPassword },
          (error, results) => {
            if (error) {
              console.error(error.message);
              return res.status(500).send("Server error");
            }

            const payload = {
              user: {
                id: results.insertId,
              },
            };

            jwt.sign(
              payload,
              "secretToken", // Replace with a secure secret later
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        );
      }
    );
  } catch (err) {
    console.log("///////////////////////////////");
    console.error(err.message);
    console.log("///////////////////////////////");
    res.status(500).send("Server error");
  }
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = req.db;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "secretToken", // Replace with a secure later
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    }
  );
});

// Profile route (protected)
router.get("/profile", auth, (req, res) => {
  const db = req.db;
  db.query(
    "SELECT id, username, email FROM users WHERE id = ?",
    [req.user.id],
    (error, results) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.json(results[0]);
    }
  );
});

module.exports = router;
