const jwt = require("jsonwebtoken");

module.exports = function genToken(user, expiresIn = "2h") {
  const userPayload = { id: user.id, role: user.role };

  return jwt.sign({ user: userPayload }, process.env.USER_TOKEN_SECRET, {
    expiresIn,
  });
};
