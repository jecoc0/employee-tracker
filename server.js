const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
const express = require('express');


const PORT = process.env.PORT || 3001;
const app = express();


const apiRoutes = require('./routes/apiRoutes');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// add after Express middleware
app.use('/api', apiRoutes);


// console.table([
//   {
//     name: 'foo',
//     age: 10
//   }, 
//   {
//     name: 'bar',
//     age: 20
//   }
// ]);

// console.log(console.table)

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});



// Default response for any other request (Not Found) "catchall"
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

