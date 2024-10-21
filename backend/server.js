const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

const app = express();

// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "nikinemko",
  password: "nikinemko",
  database: "nodeback",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + db.threadId);
});

app.use((req, res, next) => {
  req.db = db;
  next();
});
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
