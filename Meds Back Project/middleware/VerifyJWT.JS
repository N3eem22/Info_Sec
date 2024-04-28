const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); 
  const token = cookies.jwt;
  jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) {
      console.log('Error decoding token:', err);
      return res.sendStatus(403); // Token verification failed
    }

    req.user = {
      email: decoded.UserInfo.email,
      role: decoded.UserInfo.role, // Check if the role is defined as 'role' in the token
      id: decoded.UserInfo.id
    };

    next();
  });
};

module.exports = verifyJWT;
