
const authorized = async (req, res, next) => {
  //console.log(req.session);
  if (  req.user) {
    //console.log(user.token);
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized to access this route !",
    });
  }
};

module.exports = authorized;