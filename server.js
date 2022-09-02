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
  db.query(`SELECT department.id AS "Department ID", department.name AS "Department" FROM department`, function (err, results) {
    console.log(`*******************************`.yellow);
    console.log(`*** Viewing All Departments ***`.yellow);
    console.log(`*******************************`.yellow);
    console.table(results);
    console.log(`**********************`.green);
    console.log(`*** Query Complete ***`.green);
    console.log(`**********************`.green);
    start();
  });
}

const viewAllRoles = () => {
  db.query(`SELECT role.id AS "Role ID", role.title AS "Job Title", role.salary AS "Salary", role.department_id AS "Department ID" FROM role`, function (err, results) {
    console.log(`*************************`.yellow);
    console.log(`*** Viewing All Roles ***`.yellow);
    console.log(`*************************`.yellow);
    console.table(results);
    console.log(`**********************`.green);
    console.log(`*** Query Complete ***`.green);
    console.log(`**********************`.green);
    start();
  });
}

const viewAllEmployees = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Would you like to sort your employee view?",
        choices: [
          "View by employee last name",
          "View by manager",
          "View by department",
          "View by id",
          "Back",
        ],
        name: "selection",
      },
    ])
    .then((response) => {
      switch (response.selection) {
        case 'View by employee last name':
          viewEmployeesByLastName();
          break;
        case 'View by manager':
          viewEmployeesByManager();
          break;
        case 'View by department':
          viewEmployeesByDepartment();
          break;
        case 'View by id':
          viewEmployeesById();
          break;
        case 'Back':
          start();
          break;
        default:
          throw new Error('invalid initial user choice');
      }
    })
}

const viewEmployeesByLastName = () => {
  db.query(`SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", IFNULL(CONCAT(manager.first_name, ' ', manager.last_name), '-----') AS "Manager" FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id JOIN role ON employee.role_id = role.id JOIN department on role.department_id = department.id ORDER BY employee.last_name, employee.first_name`, function (err, results) {
    console.log(`******************************************`.yellow);
    console.log(`*** Viewing All Employees By Last Name ***`.yellow);
    console.log(`******************************************`.yellow);
    console.table(results);
    console.log(`**********************`.green);
    console.log(`*** Query Complete ***`.green);
    console.log(`**********************`.green);
    viewAllEmployees();
  });
}

const viewEmployeesByManager = () => {
  db.query(`SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", IFNULL(CONCAT(manager.first_name, ' ', manager.last_name), '-----') AS "Manager" FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id JOIN role ON employee.role_id = role.id JOIN department on role.department_id = department.id ORDER BY manager.id, employee.id`, function (err, results) {
    console.log(`****************************************`.yellow);
    console.log(`*** Viewing All Employees By Manager ***`.yellow);
    console.log(`****************************************`.yellow);
    console.table(results);
    console.log(`**********************`.green);
    console.log(`*** Query Complete ***`.green);
    console.log(`**********************`.green);
    viewAllEmployees();
  });
}

const viewEmployeesByDepartment = () => {
  db.query(`SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", IFNULL(CONCAT(manager.first_name, ' ', manager.last_name), '-----') AS "Manager" FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id JOIN role ON employee.role_id = role.id JOIN department on role.department_id = department.id ORDER BY department.id, employee.id`, function (err, results) {
    console.log(`*******************************************`.yellow);
    console.log(`*** Viewing All Employees By Department ***`.yellow);
    console.log(`*******************************************`.yellow);
    console.table(results);
    console.log(`**********************`.green);
    console.log(`*** Query Complete ***`.green);
    console.log(`**********************`.green);
    viewAllEmployees();
  });
}

const viewEmployeesById = () => {
  db.query(`SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", IFNULL(CONCAT(manager.first_name, ' ', manager.last_name), '-----') AS "Manager" FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id JOIN role ON employee.role_id = role.id JOIN department on role.department_id = department.id ORDER BY employee.id`, function (err, results) {
    console.log(`***********************************`.yellow);
    console.log(`*** Viewing All Employees By Id ***`.yellow);
    console.log(`***********************************`.yellow);
    console.table(results);
    console.log(`**********************`.green);
    console.log(`*** Query Complete ***`.green);
    console.log(`**********************`.green);
    viewAllEmployees();
  });
}

// Add functions
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What's the new department name?"
      }
    ]).then((response) => {
      db.query(`INSERT INTO department SET ?`,
      {
        name: response.name,
      }, (err, res) => {
        if (err) throw err;
        console.log(`*****************************`.green);
        console.log("*** New department added! ***".green)
        console.log(`*****************************`.green);
        viewAllDepartments();
      })
    }).catch(err => {
      console.log(err);
    });
}

const getDepartments = () => {
  return new Promise ((resolve, reject) => {
    db.query(`SELECT * FROM department`, (err, res) => {
      if (err) throw err;
      return resolve(res);
    })
  })
}

const addRole = () => {
  const array = [];
  getDepartments()
  .then(data => {
    for (let i=0; i < data.length; i++) {
      array.push(data[i])
    }
  })
  .catch(err => {
    console.log(err.red);
  })
  
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What's the title of the new role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What's the salary for the new role?"
      },
      {
        type: "list",
        name: "department",
        message: "Which department will the new role report to?",
        choices: array
      }
    ]).then((response) => {
      let departmentId;
      for (let i = 0; i < array.length; i++) {
          if (response.department === array[i].name) {
              departmentId = array[i].id;
          }
      }

      db.query(`INSERT INTO role SET ?`,
      {
        title: response.title,
        salary: response.salary,
        department_id: departmentId
      }, (err) => {
        if (err) throw err;
        console.log(`***********************`.green);
        console.log("*** New role added! ***".green)
        console.log(`***********************`.green);
        viewAllRoles();
      })
    })
}

// Promises to query db for Departments, Roles, Employees
const getRolesAsync = () => {
  return new Promise ((resolve, reject) => {
    db.query(`SELECT id, title as 'role' FROM role`, (err, res) => {
      if (err) throw err;
      return resolve(res);
    })
  })
}

const getEmployeesAsync = () => {
  return new Promise ((resolve, reject) => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id`, (err, res) => {
      if (err) throw err;
      return resolve(res);
    })
  })
}

const getDepartmentsAsync = () => {
  return new Promise ((resolve, reject) => {
    db.query(`SELECT id, name FROM department`, (err, res) => {
      if (err) throw err;
      return resolve(res);
    })
  })
}

const addEmployee = () => {
  const rolesData = [];
  const rolesNames = [];
  const employeesData = [];
  const employeesNames = ['No Manager'];

  getRolesAsync()
  .then(data => {
      for (let i = 0; i < data.length; i++) {
          rolesData.push(data[i]);
          rolesNames.push(data[i].role)
      }

      getEmployeesAsync()
      .then(data => {
          for (let i = 0; i < data.length; i++) {
              employeesData.push(data[i]);
              employeesNames.push(data[i].last_name)
          }
      }).catch(err => {
          console.log(err);
      })
  }).catch(err => {
      console.log(err);
  });

  inquirer.prompt([
      {
          type: 'input',
          name: 'firstName',
          message: `What is the employee's first name?`,
          default: () => {},
          validate: firstName => {
              let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(firstName);
              if (valid) {
                  return true;
              } else {
                  console.log(`. Your name must be between 1 and 30 characters.`)
                  return false;
              }
          }
      },
      {
          type: 'input',
          name: 'lastName',
          message: `What is the employee's last name?`,
          default: () => {},
          validate: lastName => {
              let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(lastName);
              if (valid) {
                  return true;
              } else {
                  console.log(`. Your name must be between 1 and 30 characters.`)
                  return false;
              }
          }

      },
      {
          type: 'list',
          name: 'role',
          message: `What is the employee's role?`,
          choices: rolesNames
      },
      {
          type: 'list',
          name: 'manager',
          message: `Who is the employee's manager?`,
          choices: employeesNames
      }
  ]).then(response => {
      let roleId;
      let managerId;

      for (let i = 0; i < rolesData.length; i++) {
          if (response.role === rolesData[i].role) {
              roleId = rolesData[i].id;
          }
      }

      for (let i = 0; i < employeesData.length; i++) {
          if (response.manager === employeesData[i].last_name) {
              managerId = employeesData[i].id;
          } else if (response.manager === 'No Manager') {
              managerId = null;
          }
      }
      
      db.query(`INSERT INTO employee SET ?`,
      {
        first_name: response.firstName,
        last_name: response.lastName,
        role_id: roleId,
        manager_id: managerId
      }, (err) => {
        if (err) throw err;
        console.log(`*************************************`.green);
        console.log(` Employee ${response.firstName} ${response.lastName} added! `.green)
        console.log(`*************************************`.green);
        console.log('\n');
        viewAllEmployees();
      })       
  });
}

// Update Employee Role
const updateEmployeeRole = () => {
  const rolesData = [];
  const rolesNames = [];
  const employeesData = [];
  const employeesNames = [];

  getRolesAsync()
  .then(data => {
      for (let i = 0; i < data.length; i++) {
          rolesData.push(data[i]);
          rolesNames.push(data[i].role);
      }

      getEmployeesAsync()
      .then(data => {
          for (let i = 0; i < data.length; i++) {
              employeesData.push(data[i]);
              employeesNames.push(data[i].first_name + " " +data[i].last_name + ", " +data[i].title);        
          }
          // console.log(employeesNames)
          inquirer.prompt([
            {
              type: 'list', 
              name: 'employee',
              message: 'Which employee would you like to update?',
              choices: employeesNames
            }
          ]).then(response => {
              let employeeId;
              for (let i = 0; i < employeesData.length; i++) {
                if (response.employee === (employeesData[i].first_name + " " +employeesData[i].last_name + ", " +employeesData[i].title)) {
                    employeeId = employeesData[i].id;
                }
              }
              getNewRoleId(employeeId, rolesData, rolesNames);
          })

      }).catch(err => {
        console.log(err);
      });
  })

}

// Subfunction to Update Employee Role
const getNewRoleId = (employeeId, rolesData, rolesNames) => {
  inquirer.prompt([
      {
          type: 'list',
          name: 'role',
          message: `What is the employee's new role?`,
          choices: rolesNames
      }
  ]).then(answers => {
      let roleId;
      for (let i = 0; i < rolesData.length; i++) {
          if (answers.role === rolesData[i].role) {
              roleId = rolesData[i].id;
          }
      }

      db.query(`UPDATE employee SET ? WHERE ?`, [
        {
          role_id: roleId
        },
        {
          id: employeeId
        }
      ],
      (err, res) => {
        if (err) throw err;
        console.log(`*************************************`.green);
        console.log(`*** Update Employee Role Complete ***`.green);
        console.log(`*************************************`.green);
        console.log('\n');
        start();
      })
  })
}

// Delete Department
const deleteDepartment = () => {
  const departmentData = [];
  const departmentNames = [];

  getDepartmentsAsync()
  .then(data => {
    for (let i=0; i < data.length; i++) {
      departmentData.push(data[i]);
      departmentNames.push(data[i].name);
    }
    // console.log(data)
    inquirer.prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Which department would you like to delete?',
        choices: departmentNames
      }
    ]).then(response => {
      // console.log(response)
      // console.log(response.department)      
      // console.log(departmentData)
      // console.log(departmentNames)
      
      let departmentId;
      for (let i = 0; i < departmentData.length; i++) {
        if (response.department === departmentNames[i]) {
          departmentId = departmentData[i].id;
        }
      }
      console.log(departmentId)
      db.query(`DELETE FROM department WHERE ?`, {id: departmentId}, (err, res) => {
        if (err) throw err;
        console.log(`***************************************`.green);
        console.log(`*** Department Successfully Deleted ***`.green);
        console.log(`***************************************`.green);
        viewAllDepartments();
      })
    }).catch(err => {
      console.log(err);
    });
  })
}

const deleteRole = () => {
  const roleData = [];
  const roleNames = [];

  getRolesAsync()
  .then(data => {
    for (let i=0; i < data.length; i++) {
      roleData.push(data[i]);
      roleNames.push(data[i].role);
    }
    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: 'Which role would you like to delete?',
        choices: roleNames
      }
    ]).then(response => {
      let roleId;
      for (let i = 0; i < roleData.length; i++) {
        if (response.role === roleNames[i]) {
          roleId = roleData[i].id;
        }
      }
      console.log(roleId)
      db.query(`DELETE FROM role WHERE ?`, {id: roleId}, (err, res) => {
        if (err) throw err;
        console.log(`*********************************`.green);
        console.log(`*** Role Successfully Deleted ***`.green);
        console.log(`*********************************`.green);
        viewAllRoles();
      })
    }).catch(err => {
      console.log(err);
    });
  })
}

const deleteEmployee = () => {
  const employeesData = [];
  const employeesNames = [];

  getEmployeesAsync()
  .then(data => {
    for (let i=0; i < data.length; i++) {
      employeesData.push(data[i]);
      employeesNames.push(data[i].first_name + " " +data[i].last_name);
    }
    // console.log(data)
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to delete?',
        choices: employeesNames
      }
    ]).then(response => {
      // console.log(response)
      // console.log(response.employee)      
      // console.log(employeesData)
      // console.log(employeesNames)
      
      let employeeId;
      for (let i = 0; i < employeesData.length; i++) {
        if (response.employee === employeesNames[i]) {
          employeeId = employeesData[i].id;
        }
      }
      console.log(employeeId)
      db.query(`DELETE FROM employee WHERE ?`, {id: employeeId}, (err, res) => {
        if (err) throw err;
        console.log(`*************************************`.green);
        console.log(`*** Employee Successfully Deleted ***`.green);
        console.log(`*************************************`.green);
        viewAllEmployees();
      })
    }).catch(err => {
      console.log(err);
    });
  })
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
          "Delete department",
          "Delete role",
          "Delete employee",
          "Exit",
        ],
        name: "selection",
      },
    ])
    .then((response) => {
      
      switch (response.selection) {
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
        case 'Delete department':
          deleteDepartment();
          break;
        case 'Delete role':
          deleteRole();
          break;
        case 'Delete employee':
          deleteEmployee();
          break;
        case 'Exit':
          console.log(`
       ***********************
       *** Database Closed ***
       ***********************`.blue + `\n`);
          db.end();
          break;
        default:
          throw new Error('invalid initial user choice');
      }
    });
};

db.connect((err) => {
  if (err) throw err;
  console.log(`
      ************************
      *** `.blue+`Employee Tracker`.red+` ***
      ************************`.blue +`
      ** `.blue+`Database Connected`.green +` **
      ************************`.blue + `\n`);
  start();
});