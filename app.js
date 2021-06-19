let express = require("express");
const { mongo } = require("mongoose");
let port = 8080;

let app = express();
app.use(express.json()); //Makes sure payload is succesfully transferred to endpoint in JSON format

//Connect to Database
const mongodb = require("./mongoDB/mongodb.utils");
mongodb.connect();

//Routes
let apiRoutes = require("./routes/api-routes");
app.use("/api", apiRoutes);
/////////////////

app.get("/", (req, res) => {
  res.status(200).json("Hello from Employee APP");
});

app.listen(port, () => {
  console.log("Server Running on port", port);
});
