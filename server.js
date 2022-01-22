const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const express = require('express');
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();

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

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




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

// Get all employees
app.get('/api/employees', (req, res) => {
  const sql = `SELECT * from employees`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});


// GET a single employee
app.get('/api/employee/:id', (req, res) => {
  const sql = `SELECT * FROM employees WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Delete an employee
app.delete('/api/employee/:id', (req, res) => {
  const sql = `DELETE FROM employees WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Create an employee
app.post('/api/employee', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'role_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO employees (first_name, last_name, role_id)
    VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.role_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  }); 
});



// Default response for any other request (Not Found) "catchall"
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
