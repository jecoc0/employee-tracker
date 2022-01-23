-- INSERT INTO department(name)
-- VALUES
--   ('Accounts Payable'),
--   ('Travel'),
--   ('Office of Sponsored Projects'),
--   ('Income Accounting'),
--   ('GC Accounting');

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

INSERT INTO employees (first_name, last_name, role_id)
VALUES
  ('Sharice', 'Zobel', 1),
  ('David', 'Richards', 2),
  ('Kelsey', 'Stickler', 2),
  ('Jane', 'Haprin', 3),
  ('Markus', 'Villanova', 3),
  ('Steve', 'Stevenson', 3),
  ('Jana', 'Banana', 4),
  ('Thomas', 'Bolderton', 4),
  ('Carsyn', 'Wright', 4),
  ('Marci', 'Meyer', 5),
  ('Cecilia', 'Good', 5),
  ('Jennifer', 'Groves', 6), 
  ('Franklin', 'McDuffy', 7),
  ('Charles', 'Fielsted', 8),
  ('Aaron', 'Rogers', 8),
  ('Alyssa', 'Market', 8),
  ('Samantha', 'Christensen', 9),
  ('Kyle', 'Black', 9);
    