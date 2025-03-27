const mysql = require("mysql2");

// creating conncetion pool with promises enabled
const pool = mysql.createPool({
  host: process.env.DB_HOST, // server host
  port: 3316,
  user: "my_user", // MySQL username
  password: "my_password",
  database: "my_database", //database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the promise-based pool
module.exports = pool.promise();
