const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

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
              "secretToken", // Replace with a secure secret in a real application
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
        "secretToken", // Replace with a secure secret in a real application
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    }
  );
});

module.exports = router;
