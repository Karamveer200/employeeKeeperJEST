const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(400).json("Token not provided in header");
  }

  try {
    const jwtVerify = jwt.verify(token, "jwtSecret");
    console.log("jwtVerify - ", jwtVerify);
    req.user = jwtVerify;
    console.log("Token verification Successfull");
  } catch (error) {
    console.log(error);
    res.status(400).json("Remember We have security, Go away, Wrong Token");
  }
  next();
};

module.exports = verifyToken;
