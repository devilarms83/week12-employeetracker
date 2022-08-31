-- Seed department table
INSERT INTO department(name)
VALUES ('Operations'),
('HR'),
('Sales');

-- Seed role table
INSERT INTO role(title, salary, department_id)
VALUES ('VP Operations', 85000, 1),
('Project Coordinator', 60000, 1),
('VP HR', 80000, 2),
('Administrative Assistant', 55000, 2),
('VP Sales', 90000, 3),
('Business Development Manager', 65000, 3);

-- Seed employee table
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Al','Smith', 1, NULL),
('Bob','Debo', 2, 1),
('Sam','Antha', 2, 1),
('Raeyna','Blu', 3, NULL),
('Hillary','Plack', 4, 4),
('Caela','West', 5, NULL),
('Will','Iam', 6, 6),
('Ayra','LaFleu', 6, 6),
('Neri','Saj', 6, 6);