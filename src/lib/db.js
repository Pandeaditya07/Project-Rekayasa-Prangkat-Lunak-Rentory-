import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Kosongkan jika pakai XAMPP default
  database: "rentory",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
