const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log('JWT token is missing');
    return res.sendStatus(401); // No token found
  }
  const token = cookies.jwt;

  jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) {
      console.log('Error decoding token:', err);
      return res.sendStatus(403); // Token verification failed
    }

    console.log('Decoded JWT:', decoded);
    req.user = {
      email: decoded.UserInfo.email,
      role: decoded.UserInfo.role, // Check if the role is defined as 'role' in the token
      id: decoded.UserInfo.id
    };
    next();
  });
};

module.exports = verifyJWT;
