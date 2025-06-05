const express = require("express"); // import express framework
const cors = require('cors');
const app = express();

const apiProductRoutes = require("./routes/productRouter");
const apiAccountRoutes = require("./routes/accountRouter");
const authRoutes = require("./routes/authRouter");
const authenticateToken = require("./middleware/authMiddleware");

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Public Auth Routes
app.use("/api/auth", authRoutes);

// JWT Middleware for all other routes
app.use(authenticateToken);

// Protected Routes
app.use("/api/account", apiAccountRoutes);
app.use("/api/product", apiProductRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});