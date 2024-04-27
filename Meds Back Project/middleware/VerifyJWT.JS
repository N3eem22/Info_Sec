const jwt = require("jsonwebtoken");
const verifyJWT = (req, res, next) => {
  const cookies = req.cookies;
console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  const token = cookies.jwt;

  jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //Forbiden
    req.username = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    req.userId = decoded.UserInfo.userId;
    next();
  });
};
module.exports = verifyJWT;