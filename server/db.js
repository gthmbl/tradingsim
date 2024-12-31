const mysql = require("mysql2");

// creating conncetion pool with promises enabled
const pool = mysql.createPool({
    host: "localhost", // server host
    user: "root", // MySQL username
    password: "Goutham1!",
    database: "TradingSimAppDB", //database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Export the promise-based pool
module.exports = pool.promise();