//Cookie based login

const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5000;
const id = 1234; // store data statically
const username = "shashanksuman"; // store data statically
const secretKey = "radheshyam";

app.use(express.json()); // Middleware to parse JSON in request body
app.use(cookieParser()); // Middleware for cookie parsing

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.isLoggedin;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // Store the decoded user information in the request object
    next();
  });
};

app.post("/login", (req, res) => {
  const { usernames, user_id } = req.body;

  if (usernames === username && user_id === id) {
    const payload = { user_id: id, username: usernames };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    res.cookie("isLoggedin", token, { httpOnly: true });
    res.status(200).json({ message: "User is valid", jwt: token });
  } else {
    res.status(400).json({ message: "User is invalid" });
  }
});

// Protected route that requires authentication
app.get("/verify", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});






