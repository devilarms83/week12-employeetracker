const inquirer = require("inquirer");
const express = require('express');
const mysql = require('mysql2');
const colors = require('colors');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password1',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

// View functions
const viewAllDepartments = () => {
  db.query(`SELECT department.id AS "Department ID", department.name AS "Department" FROM company_db.department`, function (err, results) {
    console.log('\n');
    console.log(`*** Viewing All Departments ***`.green);
    console.table(results);
    console.log(`*** Query Complete ***`.green);
    start();
  });
}

// App Start
const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do? ",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add department",
          "Add role",
          "Add employee",
          "Update employee role",
          "Update employee manager",
          "View employees by manager",
          "View employees by department",
          "Delete department",
          "Delete role",
          "Delete employee",
          "View total department budget",
          "Quit",
        ],
        name: "choice",
      },
    ])
    .then((response) => {
      
      switch (response.choice) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Add role':
          addRole();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Update employee manager':
          updateEmployeeManager();
          break;
        case 'View all employees by manager':
          viewAllEmployeesByManager();
          break;
        case 'View all employees by department':
          viewAllEmployeesByDept();
          break;
        case 'Delete department':
          deleteDepartment();
          break;
        case 'Delete role':
          deleteRole();
          break;
        case 'Delete employee':
          deleteEmployee();
          break;
        case 'View total department budget':
          totalBudget();
          break;
        case 'Quit':
          connection.end();
          break;
        default:
          throw new Error('invalid initial user choice');
      }
    });
};

db.connect((err) => {
  if (err) throw err;
  console.log(`
  **********************
  ** Employee Tracker **
  **********************`.rainbow + `
  Welcome to the Employee Tracker Company Database!

  ` + `********** Database Connection Complete **********`.green
  )
  start();
});