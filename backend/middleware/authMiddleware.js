const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Check whether the request has a valid JWT.
const protect = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({
        message: "User belonging to this token no longer exists",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Authentication token has expired",
      });
    }

    return res.status(401).json({
      message: "Invalid authentication token",
    });
  }
};

// Check whether the authenticated user is an admin.
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access is required",
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
};