const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection')

const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Employees By Department',
        'Add An Employee', 
        'Remove An Employee',
        'Update An Employee Role',
        'Update An Employee Manager',
        'View All Departments', 
        'Add A Department', 
        'Remove A Department',
        'View All Roles', 
        'Add A Role', 
        'Remove Role',
        'Exit'
      ]
    }
  ])
    .then((userSelection) => {
      const {choices} = userSelection;

      if (choices === 'View All Employees') {
          viewAllEmployees();
      }

      if (choices === 'View All Employees By Department') {
          viewEmployeesByDepartment();
      }

      if (choices === 'Add An Employee') {
          addEmployee();
      }

      if (choices === 'Remove An Employee') {
          removeEmployee();
      }

      if (choices === 'Update An Employee Role') {
          updateEmployeeRole();
      }

      if (choices === 'Update An Employee Manager') {
          updateEmployeeManager();
      }

      if (choices === 'View All Departments') {
        viewAllDepartments();
      }

      if (choices === 'Add A Department') {
        addDepartment();
      }

      if (choices === 'Remove A Department') {
        removeDepartment();

      }

      if (choices === 'View Budgets By Department') {
          viewDepartmentBudget();
      }


      if (choices === 'View All Roles') {
        viewAllRoles();
      }

      if (choices === 'Add A Role') {
          addRole();
      }

      if (choices === 'Remove Role') {
          removeRole();
      }

      if (choices === 'Exit') {
          connection.end();
      }
  });
};

// -------EMPLOYEE FUNCTIONS

const viewAllEmployees = () => {
  let sql =   `SELECT e.*, 
              roles.title AS role_title,
              roles.salary AS role_salary,
              CONCAT(employees.first_name , " ", employees.last_name) AS manager_name
              FROM employees e
              LEFT JOIN roles
              ON e.role_id = roles.id
              LEFT JOIN employees
              ON employees.id = e.manager_id`;

  db.query(sql, (err, response) => {
    if (err) throw err;
    console.log('**********************************************************************')
    console.log('Current Employees')
    console.log('**********************************************************************')
    console.table(response);
    });
  };


const viewEmployeesByDepartment = () => {
  const sql =     `SELECT employees.first_name, 
                  employees.last_name, 
                  departments.name AS department
                  FROM employees 
                  LEFT JOIN roles ON employees.role_id = roles.id 
                  LEFT JOIN departments ON roles.department_id = departments.id`;
  db.query(sql, (err, response) => {
    if (err) throw err;

    console.log('**********************************************************************')
    console.log('Employees By Department')
    console.log('**********************************************************************')
    console.table(response);
  })
};

const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
  .then(answer => {
    const crit = [answer.firstName, answer.lastName]
    const roleSql = `SELECT roles.id, roles.title FROM roles`;
    db.query(roleSql, (error, data) => {
      if (error) throw error; 
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              crit.push(role);
              const managerSql =  `SELECT * FROM employees`;
              db.query(managerSql, (error, data) => {
                if (error) throw error;
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    crit.push(manager);
                    const sql =   `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                    db.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!")
                    viewAllEmployees();
                    })
                  });
              });
            });
    });
  });
}

const removeEmployee = () => {
  let sql = `SELECT employees.id, employees.first_name, employees.last_name FROM employees`;
  db.query(sql, (error, response) => {
    if(error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`)});

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee would you like to remove from the database?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId;

        response.forEach((employee) => {
          if (
            answer.chosenEmployee ===
            `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }
        });

        let sql = `DELETE FROM employees WHERE id = ?`;
        db.query(sql, [employeeId], (error) => {
          if (error) throw error;

          console.log('**********************************************************************')
          console.log('Employees By Department')
          console.log('**********************************************************************')
          console.table(response);
          viewAllEmployees();
        });
      });
  });
}


const updateEmployeeRole = () => {
  let sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.id AS "role_id"
              FROM employees, roles, departments 
              WHERE departments.id = roles.department_id 
              AND roles.id = employees.role_id`;
  
  db.query(sql, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`)});

    let sql = `SELECT roles.id, roles.title FROM roles`;
    db.query(sql, (error, response) => {
      if (error) throw error;
      let rolesArray = [];
      response.forEach((role) => {rolesArray.push(role.title);});

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'For which employee would you like to update the role?',
            choices: employeeNamesArray
          },
          {
            name: 'chosenRole',
            type: 'list',
            message: 'What is the new role for the chosen employee?',
            choices: rolesArray
          }
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `$${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls =  `UPDATE employees SET employees.role_id = ? WHERE employees.id = ?`;
          db.query(
            sqls,
            [newTitleId, employeeId],
            (error) => {
              if (error) throw error;
              
              console.log('**********************************************************************')
              console.log('Employee Role Updated')
              console.log('**********************************************************************')
              promptUser();
            }
          );
        });
    });
  });
};


const updateEmployeeManager = () => {
  let sql =       `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id
                  FROM employees`;
   db.query(sql, (error, response) => {
    let employeeNamesArray = [];
    response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee has a new manager?',
          choices: employeeNamesArray
        },
        {
          name: 'newManager',
          type: 'list',
          message: 'Who is their manager?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId, managerId;
        response.forEach((employee) => {
          if (
            answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }

          if (
            answer.newManager === `${employee.first_name} ${employee.last_name}`
          ) {
            managerId = employee.id;
          }
        });

        if (answer.chosenEmployee === answer.newManager) {
          console.log('**********************************************************************');
          console.log(`Invalid Manager Selection`);
          console.log('**********************************************************************');
          promptUser();
        } else {
          let sql = `UPDATE employees SET employees.manager_id = ? WHERE employees.id = ?`;

          db.query(
            sql,
            [managerId, employeeId],
            (error) => {
              if (error) throw error;
              console.log('**********************************************************************');
              console.log(`Employee Manager Updated`);
              console.log('**********************************************************************');
              promptUser();
            }
          );
        }
      });
  });
};

// ---------------- Department Functions

const viewAllDepartments = () => {
  const sql = `SELECT departments.id AS id, departments.name AS departments FROM departments`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    console.log('**********************************************************************');
    console.log(`All Departments`);
    console.log('**********************************************************************')
    console.table(response);
    promptUser();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?',
      }
    ])
  .then((answer) => {
    let sql =     `INSERT INTO departments (name) VALUES (?)`;
    db.query(sql, answer.newDepartment, (error, response) => {
      if (error) throw error;
      console.log('**********************************************************************')
      console.log(` Department successfully created!`);
      console.log('**********************************************************************')
      viewAllDepartments();
    });
  });
};

const removeDepartment = () => {


  let sql = `SELECT departments.id, departments.name FROM departments`;
  db.query(sql, (error, response) => {

    if (error) throw error;
    let departmentNamesArray = [];
    response.forEach((department) => {departmentNamesArray.push(department.name);});

    inquirer
      .prompt([
        {
          name: 'chosenDept',
          type: 'list',
          message: 'Which department would you like to remove?',
          choices: departmentNamesArray
        }
      ])
      .then((answer) => {
        let departmentId;

        response.forEach((department) => {
          if (
            answer.chosenDept === 
            department.name) {
            departmentId = department.id;
          }
        });

        let sql =     `DELETE FROM departments WHERE departments.id = ?`;
        db.query(sql, [departmentId], (error) => {
          if (error) throw error;
          console.log('**********************************************************************')
          console.log(`Department Successfully Removed`);
          console.log('**********************************************************************')
          viewAllDepartments();
        });
      });
  });
};

// --------- ROLE functions

const viewAllRoles = () => {
  let sql = `SELECT * FROM roles`;
  db.query(sql, (err, response) => {
    if (err) throw err;
    console.log('**********************************************************************')
    console.log('Current Employees')
    console.log('**********************************************************************')
    console.table(response);
  });
};


const addRole = () => {
  console.log('adding role firing')
  const sql = `SELECT * FROM departments`
  db.query(sql, (err, response) => {
    if (err) throw err;
    let deptNamesArray = [];
    response.forEach((department) => {deptNamesArray.push(department.name);});
    deptNamesArray.push('Create Department')
    inquirer
      .prompt([
        {
          name:'departmentName',
          type: 'list',
          message: 'Which department is this new role in?',
          choices: deptNamesArray
        }
      ])
      .then((answer) => {
        if (answer.departmentName === 'Create Department') {
          this.addDepartment();
        } else {
          addRoleResume(answer);
        }
      });

      const addRoleResume = (departmentData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of the new role you would like to add?'
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary for the new role?'
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            response.forEach((department) => {
              if (departmentData.departmentName === department.name) {departmentId = department.id;}
            });

            let sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
            let crit = [createdRole, answer.salary, departmentId];

            db.query(sql, crit, (err) => {
              if (err) throw err;

              console.log('**********************************************************************')
              console.log('Role successfully created')
              console.log('**********************************************************************')
              viewAllRoles();
            });
          });
      };
  });
};

const removeRole = () => {
  let sql = `SELECT roles.id, roles.title FROM roles`;

  db.query(sql, (error, response) => {
    if (error) throw error;
    let roleNamesArray = [];
    response.forEach((role) => {roleNamesArray.push(role.title);});

    inquirer
      .prompt([
        {
          name: 'chosenRole',
          type: 'list',
          message: 'Which role would you like to remove?',
          choices: roleNamesArray
        }
      ])
      .then((answer) => {
        let roleId;

        response.forEach((role) => {
          if (answer.chosenRole === role.title) {
            roleId = role.id;
          }
        });

        let sql = `DELETE FROM roles WHERE id = ?`;
        db.query(sql, [roleId], (error) => {
          if (error) throw error;
          console.log('**********************************************************************')
          console.log('Role successfully removed')
          console.log('**********************************************************************')
          viewAllRoles();
        })
      })
  })
}

promptUser();
  
