const jwt = require("jsonwebtoken");

export function authenticate(req, res, next) {
  const token =
    req.cookies?.userToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(404).json({ status: "error", message: "No token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "error", message: "Invalide token" });
  }
}

export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ status: "error", message: "Access denied" });
    }
    next();
  };
}
