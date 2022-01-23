INSERT INTO departments(name)
VALUES
  ('Accounts Payable'),
  ('Travel'),
  ('Office of Sponsored Projects'),
  ('Income Accounting'),
  ('GC Accounting');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Director of AP', 200000.00, 1),
  ('Travel Planner', 45000.00, 2),
  ('Reimbursement Admin', 39850.00, 2),
  ('Grants and Contracts Officer', 60000.00, 3),
  ('Grants Manager', 85000.00, 3),
  ('Deposit Processor', 40000.00, 4),
  ('Director of Income', 150000.00, 4),
  ('Grants Accountant', 58000.00, 5),
  ('Grants Manager', 87000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Sharice', 'Zobel', 1, NULL),
  ('David', 'Richards', 2, 1),
  ('Kelsey', 'Stickler', 2, 1),
  ('Jane', 'Haprin', 3, 2),
  ('Markus', 'Villanova', 3, 2),
  ('Steve', 'Stevenson', 3, 3),
  ('Jana', 'Banana', 4, 10),
  ('Thomas', 'Bolderton', 4, 10),
  ('Carsyn', 'Wright', 4, 11),
  ('Marci', 'Meyer', 5, 1),
  ('Cecilia', 'Good', 5, 1),
  ('Jennifer', 'Groves', 6, 13), 
  ('Franklin', 'McDuffy', 7, NULL),
  ('Charles', 'Fielsted', 8, 17),
  ('Aaron', 'Rogers', 8, 17),
  ('Alyssa', 'Market', 8, 18),
  ('Samantha', 'Christensen', 9, 1),
  ('Kyle', 'Black', 9, 1);
    