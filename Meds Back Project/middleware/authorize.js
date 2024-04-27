const conn = require("../db/dbConnection");
const util = require("util"); // helper

const authorized = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  let token;
  //console.log(req.body);
  if(req.headers.token != undefined){
    token  = req.headers.token;
    //console.log(req.headers.token);
  }
  else{ 
    token  = req.body.headers.token;
  }



  const user = await query("select * from users where token = ?", [token]);
  if (user[0] &&  req.session.user) {
    res.locals.user = user[0];
    //console.log(user.token);
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized to access this route !",
    });
  }
};

module.exports = authorized;