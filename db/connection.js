const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'personnel'
  },
  console.log('Connected to the personnel database')
);

module.exports = db;