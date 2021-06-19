const controller = require("../controller/employee.controller");

let router = require("express").Router();

const verifyToken = require("./jwt-token-verify");

router.get("/", (req, res) => {
  res.status(200).json("Welcome to the Employee api route");
});

//Create Employee
router.post("/contacts", controller.createEmployee);

//Get All Employees
router.get("/contacts", controller.getAllEmployees);

//Get Employee by Id
router.get("/contacts/:employee_id", controller.getEmployeeById);

//Update Employee by Id
router.put(
  "/contacts/:employee_id",
  verifyToken,
  controller.updateEmployeeById
);

//Delete Employee by Id
router.delete("/contacts/:employee_id", controller.deleteEmployeeById);

//Login Employee
router.post("/contacts/login", controller.loginEmployee);

module.exports = router;
