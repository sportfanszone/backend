const jwt = require("jsonwebtoken");
const getUser = require("../utils/getUser");

async function authenticate(req, res, next) {
  const token =
    req.cookies?.userToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(404)
      .json({ status: "error", message: "No token", action: "logout" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN_SECRET);
    req.user = decodedToken?.user;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ status: "error", message: "Invalide token", action: "logout" });
  }
}

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied",
        action: "accessDenied",
      });
    }
    next();
  };
}

module.exports = { authenticate, authorizeRole };
