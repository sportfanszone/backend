const passport = require("passport");

module.exports = async (req, res, next) => {
  return passport.authenticate("google", { scope: ["profile", "email"] });
};
