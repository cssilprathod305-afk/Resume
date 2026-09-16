const mysql = require("mysql2");

    console.log("DB HOST:", process.env.DB_HOST);
    console.log("DB PORT:", process.env.DB_PORT);
    console.log("DB USER:", process.env.DB_USER);
    console.log("DB NAME:", process.env.DB_NAME);  

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
    console.log("MySQL connection failed:", err);
} else {
    console.log("MySQL connected successfully!");
}
});

module.exports = db;