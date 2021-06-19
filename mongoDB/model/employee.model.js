let mongoose = require("mongoose");

let contactSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, min: 6 },
  gender: { type: String },
  phone: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

//When mongoDB creates database, it always add extra 's' in the model name.
mongoose.pluralize(null); //This avoids above statement

module.exports = employeeModel = mongoose.model(
  "myEmployee_test",
  contactSchema
);
