const jwt = require("jsonwebtoken");

// Middleware to verify the presence and validity of a JWT token in the request headers
const verifyToken = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(404).json({ message: "No token provided" });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedUser;
    next();
  } catch (error) {
    return res.status(404).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user has admin privileges or matches the requested user ID
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    const { id, isAdmin } = req.user;
    if (id === req.params.id || isAdmin) {
      next();
    } else {
      return res.status(406).json({
        message: "Access denied. Only admin or owner has access",
      });
    }
  });
};

// Middleware to check if the user matches the requested user ID
const verifyTokenOnlyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    const { id } = req.user;
    if (id === req.params.id) {
      next();
    } else {
      return res.status(406).json({
        message: "Access denied. Only the owner has access",
      });
    }
  });
};

// Middleware to check if the user has admin privileges
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    const { isAdmin } = req.user;
    if (isAdmin) {
      next();
    } else {
      return res.status(406).json({
        message: "Access denied. Only admin has access",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenOnlyUser,
  verifyTokenAndAuthorization,
};
