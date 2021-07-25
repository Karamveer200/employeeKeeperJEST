let employeeModel = require("../../mongoDB/model/employee.model");
let controller = require("../../controller/employee.controller");

const httpMock = require("node-mocks-http");
const mockData = require("../mockData/employees.json");
let req, res, next;
employeeModel.findById = jest.fn();

req = httpMock.createRequest();
res = httpMock.createResponse();
next = null;

describe("controller.getEmployeeById", () => {
  test("getEmployeeById function is defined", () => {
    expect(typeof controller.getEmployeeById).toBe("function");
  });

  test("return an employee by Id", async () => {
    req.params.employee_id = mockData[0]._id;
    employeeModel.findById.mockReturnValue(mockData[0]);
    await controller.getEmployeeById(req, res, next);
    expect(employeeModel.findById).toHaveBeenCalledWith(req.params.employee_id);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockData[0]);
  });
});
