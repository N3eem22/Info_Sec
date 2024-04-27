const { log } = require("util");
const conn = require("../db/dbConnection");
const util = require("util"); // helper

const authorized = async (req, res, next) => {
  //console.log(req.session);
  if (  req.session.user) {
    //console.log(user.token);
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized to access this route !",
    });
  }
};

module.exports = authorized;