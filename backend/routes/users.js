const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

console.log("users!!");
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
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
