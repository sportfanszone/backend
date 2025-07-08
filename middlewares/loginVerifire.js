const jwt = require("jsonwebtoken");
const logout = require("../utils/logout");
const login = require("../utils/login");
const getUser = require("../utils/getUser");

module.exports = async function (req, res, next) {
  try {
    console.log(req.baseUrl);
    const userToken = req.cookies?.userToken;

    if (!userToken) {
      console.log("No user token found in cookies.");
      logout(res);
      return next();
    }

    const tokenPayload = jwt.verify(userToken, process.env.USER_TOKEN_SECRET);

    if (!tokenPayload?.user?.id) {
      console.log("Token payload is invalid.");
      logout(res);
      return next();
    }

    const user = await getUser(tokenPayload.user.id);

    if (!user) {
      console.log("User not found in database.");
      logout(res);
      return next();
    }

    req.user = user;
    // logout(res);
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    login(user, res);

    return next();
  } catch (error) {
    console.error("Error verifying login:", error);
    return next();
  }
};
