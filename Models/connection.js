const mysql = require("mysql");
const util = require("util");

const dbURI = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;

const pool = mysql.createPool({
  connectionLimit: 10, // Set the maximum number of connections
  host: dbURI,
  user: user,
  password: pass,
  database: db_name,
});

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected to MySQL server!");

  // Release the connection when it's no longer needed
  connection.release();
});

// Use util.promisify to convert the callback-based query method to a Promise-based method
const query = util.promisify(pool.query).bind(pool);
module.exports = query;