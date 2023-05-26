const mysql = require("mysql");
var util = require("util");

const dbURI = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;

const connection = mysql.createConnection({
  host: dbURI,
  user: user,
  password: pass,
  database: db_name,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL server!");
});

const query = util.promisify(connection.query).bind(connection);
module.exports = query;
