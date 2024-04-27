const admin = (req, res, next) => {
  if (!req.user) {
    // If there's no user data, the user is not authenticated
    return res.status(403).json({
      msg: "Error Uccured",
    });
  }

  if (req.user.role !== 1) {
    // Check if user role is not admin
    return res.status(403).json({
      msg: "You are not authorized to access this route!",
    });
  }

  // If the user is an admin, continue to the next middleware or route handler
  next();
};

module.exports = admin;
