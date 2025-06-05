require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sql, poolPromise } = require("../config/db");

async function login(req, res) {
    const { username, password } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Account WHERE Username = @username');
        const user = result.recordset[0];

        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });
        const token = jwt.sign(
            { userId: user.AccountID, role: user.Role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Register function
async function register(req, res) {
    const { username, password, email, fullName, dateOfBirth, role } = req.body;

    try {
        const pool = await poolPromise;

        // Check if user already exists
        const checkUser = await pool
            .request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Account WHERE Username = @username');
        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email already exists
        const checkEmail = await pool
            .request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Account WHERE Email = @email');
        if (checkEmail.recordset.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await pool
            .request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .input('fullName', sql.VarChar, fullName)
            .input('dateOfBirth', sql.Date, dateOfBirth || null)
            .input('role', sql.VarChar, role || 'user')
            .input('createdAt', sql.DateTime2, new Date())
            .query(
                `INSERT INTO Account 
          (Username, Email, Password, FullName, DateOfBirth, Role, CreatedAt) 
         VALUES 
          (@username, @email, @password, @fullName, @dateOfBirth, @role, @createdAt)`
            );

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    login,
    register,
};