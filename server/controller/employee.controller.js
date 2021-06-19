let employeeModel = require("../mongoDB/model/employee.model");
const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().min(6).required(),
  gender: joi.string(),
  phone: joi.string(),
});

const schema_login = joi.object({
  email: joi.string().required(),
  password: joi.string().min(6).required(),
});

exports.createEmployee = async (req, res, next) => {
  try {
    console.log("create new employee called");

    //Validate req body
    const joiCheck = await schema.validate(req.body);
    if (joiCheck.error) {
      return res.status(400).json(joiCheck.error);
    }

    //Check if user Exists
    const alreadyExists = await employeeModel.findOne({
      email: req.body.email,
    });
    if (alreadyExists) {
      return res.status(400).json("User already Exists. Use different Email");
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);
    console.log("Encrypted Password - ", encryptedPassword);
    req.body.password = encryptedPassword;

    //Create new Employee
    const newEmployee = await employeeModel.create(req.body);
    console.log(newEmployee);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//GET all Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const allEmployees = await employeeModel.find({});
    if (allEmployees && allEmployees.length > 0) {
      return res.status(200).json(allEmployees);
    } else {
      return res.status(404).json("No employee Found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeModel.findById(req.params.employee_id);

    if (employee) {
      return res.status(200).json(employee);
    } else {
      return res.status(404).json("Employee with requested Id not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateEmployeeById = async (req, res) => {
  try {
    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      req.params.employee_id,
      req.body,
      { useFindAndModify: false }
    );

    if (updatedEmployee) {
      return res.status(201).json(updatedEmployee);
    } else {
      return res.status(404).json("Employee with requested Id not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteEmployeeById = async (req, res) => {
  employeeModel
    .findByIdAndDelete(req.params.employee_id)
    .then((result) => {
      if (result) {
        console.log("User deleted - ", result);
        res.status(200).json(result);
      } else {
        res.status(404).json("User Not Found");
      }
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
};

exports.loginEmployee = async (req, res, next) => {
  try {
    //Validate req body
    const joiCheck = await schema_login.validate(req.body);
    if (joiCheck.error) {
      return res.status(400).json(joiCheck.error);
    }

    //check if email exists
    const employee = await employeeModel.findOne({ email: req.body.email });
    if (!employee) {
      return res.status(400).json("Email not found");
    }

    //check if password matches
    const validatePassword = await bcrypt.compare(
      req.body.password,
      employee.password
    );
    if (!validatePassword) {
      return res.status(400).json("Incorrect Password");
    }
    const jwtToken = jwt.sign(
      {
        data: employee,
      },
      "jwtSecret",
      {
        expiresIn: "1h",
      }
    );

    res.header("auth-token", jwtToken);

    return res.status(201).json(employee);
  } catch (error) {
    res.status(500).json(error);
  }
};
