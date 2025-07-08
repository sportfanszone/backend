const jwt = require("jsonwebtoken");
const genToken = require("../../utils/genToken");

module.exports = async (req, res) => {
  try {
    const user = req.user.toJSON();

    if (!user) {
      return res.status(500).json({
        status: "error",
        message: "An unexpected error occurred",
      });
    }

    let expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // Generate JWT token
    const token = genToken(user);

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires,
    });
    res.redirect(`${process.env.FRONTEND_URL}/user/dashboard`);
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
