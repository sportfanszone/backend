const passport = require("passport");
const genToken = require("../../utils/genToken");

module.exports = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error) return next(error);
    if (!user)
      return res.status(500).json({
        status: "error",
        message: info.message,
      });

    // let expiresIn = "2h";
    let expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // if (req.body.rememberMe && req.body.rememberMe === "on") {
    //   expiresIn = "3d";
    //   expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    // }

    // Generate JWT token
    // const token = jwt.sign({ user: user }, process.env.USER_TOKEN_SECRET, {
    //   expiresIn,
    // });

    const token = genToken(user);

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires,
    });

    res.json({ status: "success" });
  })(req, res, next);
};
