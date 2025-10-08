// Connect to the database (MySQL)

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

db.getConnection()
    .then((connection) => {
        console.log("Database connected successfully");
        connection.release();
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });
export default db;
