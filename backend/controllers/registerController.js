const bcrypt = require("bcryptjs");
const db = require("../config/db");

const registerUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Check all fields
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password and Confirm Password do not match"
            });
        }

        // Check if email already exists
        const checkUser = "SELECT * FROM users WHERE email = ?";

        db.query(checkUser, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user in MySQL
            const sql =
                "INSERT INTO users (email, password) VALUES (?, ?)";

            db.query(sql, [email, hashedPassword], (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.status(201).json({
                    message: "Registration successful"
                });
            });
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = registerUser;