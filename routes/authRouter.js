const express = require("express");
const router = express.Router();
const { login, register } = require("../controller/authController");

// Login route
router.post("/login", login);

// Register route
router.post("/register", register);

module.exports = router;