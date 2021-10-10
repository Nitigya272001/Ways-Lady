const jwt = require("jsonwebtoken");
const User = require("../models/women");

const {TOKEN_KEY} = process.env;

const  verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    const {user_id, email} = decoded;
    const user = await User.findOne({ user_id });
    res.user=user;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;