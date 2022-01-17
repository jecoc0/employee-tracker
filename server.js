const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database:'test'
// })

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




console.table([
  {
    name: 'foo',
    age: 10
  }, 
  {
    name: 'bar',
    age: 20
  }
]);

console.log(console.table)

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

