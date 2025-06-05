const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    console.log("Auth middleware called for:", req.path);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
