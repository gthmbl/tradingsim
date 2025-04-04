const mysql = require("mysql2");

// creating conncetion pool with promises enabled
const pool = mysql.createPool({
  host: process.env.DB_HOST, // server host
  port: 3306,
  user: process.env.DB_USER, // MySQL username
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, //database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the promise-based pool
module.exports = pool.promise();
